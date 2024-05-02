const express= require("express");
const app = express();
const mongoose = require("mongoose");
const body1=require('body-parser');
const Student = require('./connect');
const Book = require("./addbook");
const encoded=body1.urlencoded({extended:false})
app.use(body1.json());
app.use(express.static('src'))

app.get("/", (req,res)=>{
    res.sendFile(__dirname+'/index.html');

})
console.log(__dirname+"/index.html");

app.get('/adminLogin.html',(req,res)=>{
    res.sendFile(__dirname+'/adminLogin.html')
})
app.get('/registerStudent.html',(req,res)=>{
    res.sendFile(__dirname+'/registerStudent.html')
})
app.get('/StudentDashboard',(req,res)=>{
    res.sendFile(__dirname+'/StudentDashboard.html')
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

app.get('/nextbookpage', (req, res) => {
    res.sendFile(__dirname + '/nextbookpage.html');
});
app.get('/borrowAndReturn', (req, res) => {
    res.sendFile(__dirname + '/borrowAndReturn.html');
});

app.get('/admin-login', (req, res) => {
    res.sendFile(__dirname + '/adminDashboard.html');
});
app.get('/registrationSuccess', (req, res) => {
    res.sendFile(__dirname + '/registrationSuccess.html');
});
app.get('/addBookSuccess', (req, res) => {
    res.sendFile(__dirname + '/addBookSuccess.html');
});
app.get('/borrowBook', (req, res) => {
    res.sendFile(__dirname + '/borrowBook.html');
});
app.get('/returnBook', (req, res) => {
    res.sendFile(__dirname + '/returnBook.html');
});
app.get('/viewBorrowedBook', (req, res) => {
    res.sendFile(__dirname + '/viewBorrowedBooks.html');
});



// Admin user name and password
const adminUsername = "kunalsah@gmail.com";
const adminPassword = "12345";


app.post('/adminLogin',encoded, async (req, res) => {
    const { username, password } = req.body;
    
    console.log(username)

    if (username === adminUsername && password === adminPassword) {
        res.redirect('/admin-login'); 
    } else {
        res.status(401).send('Invalid username or password');
    }
});

app.post('/registerStudent',encoded, async (req, res) => {
    try {
        const { fname, lname, registrationNo, password } = req.body;

        const newStudent = new Student({ fname, lname, registrationNo, password });

        await newStudent.save();
t
        res.redirect('/registrationSuccess')

    } catch (error) {
        console.error('Error registering student:', error);
        res.redirect('/registrationSuccess')
    }
});




app.post('/studentLogin', encoded, async (req,res)=>{
    const registrationNo1=req.body.registrationNo;
    const password1 = req.body.password;

    console.log("Username:", registrationNo1);
    console.log("Password:", password1);

    Student.findOne({ registrationNo:registrationNo1, password:password1 })
        .then(student1 => {
            if (student1) {
                res.redirect('/StudentDashboard');
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

    } catch (error) {
      console.error("Error adding book:", error);
      res.status(500).json({ message: "Internal server error" });
    }
});



app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post('/borrow', async (req, res) => {
    try {
        const { registrationNo, isbn } = req.body;

        const student = await Student.findOne({ registrationNo });
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        const book = await Book.findOne({ isbn });
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        if (student.borrowedBooks.includes(book._id)) {
            return res.status(400).json({ message: 'You have already borrowed this book.' });
        }
        if (book.quantity <= 0) {
            return res.status(400).json({ message: 'Book is not available for borrowing.' });
        }
        student.borrowedBooks.push(book._id);
        book.quantity -= 1;

        await student.save();
        await book.save();

        return res.status(200).json({ message: 'Book borrowed successfully.' });
    } catch (error) {
        console.error('Error borrowing book:', error);
        return res.status(500).json({ message: 'An error occurred while borrowing the book.' });
    }
});

app.post('/return', async (req, res) => {
    try {
        const { registrationNo, isbn } = req.body;

        const student = await Student.findOne({ registrationNo });
        if (!student) {
            return res.status(404).send('Student not found.');
        }
        const book = await Book.findOne({ isbn });
        if (!book) {
            return res.status(404).send('Book not found.');
        }
        if (!student.borrowedBooks.includes(book._id)) {
            return res.status(400).send('This Student have not borrowed this book.');
        }

        student.borrowedBooks.pull(book._id);
        book.quantity += 1;

      
        await student.save();
        await book.save();

        res.status(200).send('Book returned successfully');
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).send('Internal Server Error');
    }
});





app.listen(8080, ()=>{
    console.log("Server is running on port 8080")
})








