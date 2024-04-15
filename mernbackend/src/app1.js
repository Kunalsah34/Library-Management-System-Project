const express= require("express");
const app = express();
const body1=require('body-parser');
const Student1 = require("./connect");
const Student = require('./connect');
const Book = require("./addbook");
const encoded=body1.urlencoded({extended:false})
app.use(body1.json());

app.get("/", (req,res)=>{
    res.sendFile(__dirname+'/index.html');
})
console.log(__dirname+"/index.html");
app.post('/signup',encoded,async (req,res)=>{
    let student = await Student1(req.body);
    student.save()
        .then(() => {
            res.send(`
            <h2>User registered successfully!</h2>
            <p>Click <a href="/login">here</a> to login or
             click <a href="/">here</a> for register another user.</p>
        `);
        })
        .catch(err => console.log(err))
})
app.get('/adminLogin.html',(req,res)=>{
    res.sendFile(__dirname+'/adminLogin.html')
})
app.get('/registerStudent.html',(req,res)=>{
    res.sendFile(__dirname+'/registerStudent.html')
})
app.get('/index.html',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
app.get('/add-book',(req,res)=>{
    res.sendFile(__dirname+'/addbook.html')
})
app.get('/addBook.html',(req,res)=>{
    res.sendFile(__dirname+'/addBook.html')
})
app.get('/addBook',(req,res)=>{
    res.sendFile(__dirname+'/addBook.html')
})
app.get("/show-books", (req, res) => {
    res.sendFile(__dirname + '/showbook.html');
});
app.get("/showBook.html", (req, res) => {
    res.sendFile(__dirname + '/showbook.html');
});
app.get("/showBook", (req, res) => {
    res.sendFile(__dirname + '/showbook.html');
});
app.get('/dashboard', (req,res)=>{
    res.send("Welcome User");
})

app.get('/nextbookpage', (req, res) => {
    res.sendFile(__dirname + '/nextbookpage.html');
});
app.get('/borrowAndReturn', (req, res) => {
    res.sendFile(__dirname + '/borrowAndReturn.html');
});
// Route to serve the admin dashboard HTML file
app.get('/admin-login', (req, res) => {
    res.sendFile(__dirname + '/adminDashboard.html');
});
app.get('/registrationSuccess', (req, res) => {
    res.sendFile(__dirname + '/registrationSuccess.html');
});
app.get('/addBookSuccess', (req, res) => {
    res.sendFile(__dirname + '/addBookSuccess.html');
});

// console.log(__dirname+"./nextbookpage");


// Admin credentials
const adminUsername = "kunalsah@gmail.com";
const adminPassword = "12345";

// Route to handle admin login
app.post('/adminLogin',encoded, async (req, res) => {
    const { username, password } = req.body;
    
    console.log(username)

    // Check if username and password match admin credentials
    if (username === adminUsername && password === adminPassword) {
        res.redirect('/admin-login'); // Redirect to admin dashboard
    } else {
        res.status(401).send('Invalid username or password'); // Unauthorized
    }
});

app.post('/registerStudent',encoded, async (req, res) => {
    try {
        // Extract student details from the request body
        const { fname, lname, registrationNo, password } = req.body;

        // Create a new student object
        const newStudent = new Student({ fname, lname, registrationNo, password });

        // Save the student object to the database
        await newStudent.save();

        // Send a success response to the client
        res.redirect('/registrationSuccess')
        // res.status(201).send('Student registered successfully!');
    } catch (error) {
        // If an error occurs, send an error response to the client
        console.error('Error registering student:', error);
        res.status(500).send('Internal Server Error');
    }
});




app.post('/studentLogin', encoded, async (req,res)=>{
    const registrationNo1=req.body.registrationNo;
    const password1 = req.body.password;
    
    console.log("Username:", registrationNo1);
    console.log("Password:", password1);

    Student1.findOne({ registrationNo:registrationNo1, password:password1 })
        .then(student1 => {
            if (student1) {
                // res.redirect('/dashboard.html');
                // res.redirect('/dashboard')
                res.redirect('/dashboard');
            } else {
                res.status(401).send('Invalid username or password');
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
})

app.post("/addBook",encoded, async (req, res) => {
    try {
      const { isbn, title, author, quantity } = req.body;
      console.log("isb:", isbn);

      const book = new Book({ isbn, title, author, quantity });
      await book.save();
        res.redirect('/addBookSuccess');

    //   alert("Book added successfully");
    //   res.render('addbook', { message: 'Book added successfully!' });
    //   res.status(201).json({ message: });
    } catch (error) {
      console.error("Error adding book:", error);
      res.status(500).json({ message: "Internal server error" });
    }
});



// Endpoint to fetch all books
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Endpoint to borrow a book
app.post('/borrow', async (req, res) => {
    const { studentId, bookId } = req.body;

    try {
        // Update student's borrowedBooks
        await Student.findByIdAndUpdate(studentId, { $push: { borrowedBooks: bookId } });

        // Decrement book quantity
        await Book.findByIdAndUpdate(bookId, { $inc: { quantity: -1 } });

        res.status(200).send('Book borrowed successfully');
    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to return a book
app.post('/return', async (req, res) => {
    const { studentId, bookId } = req.body;

    try {
        // Remove book from student's borrowedBooks
        await Student.findByIdAndUpdate(studentId, { $pull: { borrowedBooks: bookId } });

        // Increment book quantity
        await Book.findByIdAndUpdate(bookId, { $inc: { quantity: 1 } });

        res.status(200).send('Book returned successfully');
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).send('Internal Server Error');
    }
});





app.listen(8080, ()=>{
    console.log("Server is rumming on port 8080")
})








