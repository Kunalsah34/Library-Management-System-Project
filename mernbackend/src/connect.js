const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce123")
.then(()=>{
    console.log("Connection succesful");
}).catch((err)=>{
    console.log(`No connection ${err}`)
})

const signupsch = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    },
    lname:{
        type:String,
        required:true,
        trim:true
    },
    registrationNo: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    // Field to store the books borrowed by the student
    borrowedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
})


const Student = mongoose.model("StudentRegister", signupsch);
module.exports = Student;

