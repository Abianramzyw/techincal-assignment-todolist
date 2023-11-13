let { checkEmail, createUser, editTodo, createTodo, deleteTodo, deleteUser } = require('../mongodb/db')
let { getHashedPassword } = require('./function')

async function registerUser(req, res) {
    try {
        let {name, email, password, confirmPassword } = req.body
        if(name == '' || email == '' || password == '' || confirmPassword == '') {
            res.render('register', {
                message: 'Buat data akun Anda',
                messageClass: 'alert-danger'
            });
            return
        }
        if(password.length < 6 || confirmPassword < 6) {
            res.render('register', {
                message: 'Password minimal 6 huruf',
                messageClass: 'alert-danger'
            });
            return
        }
        if(password === confirmPassword) {
            let checking = await checkEmail(email)
            if(checking) {
                res.render('register', {
                    message: 'Akun sudah terdaftar',
                    messageClass: 'alert-danger'
                })
                return
            }
            let hashedPassword = getHashedPassword(password)
            createUser(name, email, hashedPassword)
            res.render('login', {
                message: 'Daftar berhasil, masuk untuk melanjutkan',
                messageClass: 'alert-success'
            });
            return
        } else {
            res.render('register', {
                message: 'Password salah',
                messageClass: 'alert-danger'
            });
            return
        }
    } catch(err) {
        console.log(err)
    }
}

async function addTodoUser(req, res) {
    try {
        let { title, dueDate } = req.body
        if (title == '' || dueDate == '') {
            res.render('todo/add', {
                message: 'Masukkan judul dan tenggat waktu',
                messageClass: 'alert-danger'
            })
            return
        }
        createTodo(req.user.id, title, dueDate)
        res.redirect('/todo')
    } catch(err) {
        console.log(err)
    }
}

async function deleteTodoUser(req, res) {
    try {
        deleteTodo(req.user.id, req.body.id)
        res.redirect('/todo')
    } catch (error) {
        console.log(error)
    }
}

async function editTodoUser(req, res) {
    try {
        let { title, dueDate, id } = req.body
        editTodo(req.user.id, req.body.id, title, dueDate)
        res.redirect('/todo')
    } catch (error) {
        console.log(error)
    }
}

async function deleteUserAccount(req, res) {
    try {
        let id = req.user.id
        let { resp } = req.body
        if (resp == 'yes') {
            deleteUser(id)
            res.render('login', {
                message: 'Berhasil menghapus akun!',
                messageClass: 'alert-success'
            });
        } else {
            res.redirect('/todo')
        }
    } catch(error) {
        console.log(error)
    }
}

module.exports = { registerUser, addTodoUser, deleteTodoUser, editTodoUser, deleteUserAccount }
