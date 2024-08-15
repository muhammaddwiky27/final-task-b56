const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const session = require('express-session')
const flash = require('express-flash')
const multer = require('multer');

const db = require ("./src/lib/db");
const {QueryTypes} = require("sequelize");


const upload = multer({storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname);
        },
    }),
});


app.set('view engine','hbs');
app.set('views','views');
app.set('trust proxy', 1);

//setup untuk mengakses static file
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

app.use(session({
    secret: "personalweb",
    cookie: {maxAge: 3600000, secure: false, httpOnly: true},
    saveUninitialized: true,
    resave: false,
    store: new session.MemoryStore(),
    })
);

app.use(flash());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

let dataBlog = [];

// routing
app.get('/', (req, res) => {
    res.render('index', {
        data: "test ini data dari backend",
    });
});

app.get('/blog', renderBlog);
app.post('/blog', upload.single('image'), addBlog);
app.get('/blog-detail/:blog_id', renderBlogDetail);
app.get('/edit-blog/:blog_id', renderEditBlog);
app.post('/edit-blog/:blog_id', editBlog);
app.get('/delete-blog/:blog_id', deleteBlog);
app.get('/login', renderLogin)
app.post('/login', login)
app.get('/register', renderRegister)
app.post('/register', register)
app.get('/logout', logout)

async function renderBlog (req, res) {
    const isLogin = req.session.isLogin;
    
    const query = `SELECT * FROM blog;`;
    const result = await db.query(query, {type: QueryTypes.SELECT});

    res.render('blog', {
        data: result,
        isLogin: isLogin,
        user: req.session.user,

    });
}

async function renderEditBlog (req, res) {
    const id = req.params.blog_id

    const blog = await db.query(`SELECT * FROM blog WHERE id = ${id}`, {
        type: QueryTypes.SELECT,
    });
    
    res.render("edit-blog", {
        data: blog[0],
    });
}

async function editBlog (req, res) {

    try {
        const id = req.params.blog_id;
        const newBlog = {
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date(),
        author: "Muhammad Dwiki Ariyadi",
    };

    // const index = dataBlog.findIndex((blog) => blog.id == id);

    // dataBlog[index] = newBlog;

    const query = `
        UPDATE blog
        SET 
        title = '${newBlog.title}',
        content = '${newBlog.content}'
        WHERE id = ${id}`;

      await db.query(query);

    res.redirect("/blog");
    } catch (error) {
        console.log(error);
        
    }
}

async function deleteBlog (req, res) {
    const id = req.params.blog_id;

    // const index = dataBlog.findIndex((blog) => blog.id == id);

    // dataBlog.splice(index, 1);

    const query = `DELETE FROM blog WHERE id = ${id}`;
    await db.query(query);

    res.redirect("/blog");
}

async function addBlog(req, res) { 
    try {
        const user = req.session.user;
        console.log(req.body);
        console.log(req.file);
        

    // const newBlog = {
    //     id: dataBlog.length + 1,
    //     title: req.body.title,
    //     content: req.body.content,
    //     createdAt: new Date(),
    //     author: "Muhammad Dwiki Ariyadi",
    // }
    
    // dataBlog.push(newBlog);

    const query = `
    INSERT INTO blog
    (title, content, created_at, author, image)
    VALUES
    ('${req.body.title}', '${req.body.content}', NOW(), '${user.fullname}', '${req.file.filename}')
    `;

    await db.query(query);

    res.redirect('/blog');
        
    } catch (error) {
        console.log(error);
        
    }
    
}

async function renderBlogDetail (req, res) {
    const id = req.params.blog_id

    const blog = await db.query(`SELECT * FROM blog WHERE id = ${id}`, {type: QueryTypes.SELECT,

    });
    
    res.render('blog-detail', {
        data: blog[0],
    });
}

function renderLogin(req, res) {
    console.log(req.session);
    
        const isLogin = req.session.isLogin;
    if (isLogin) {
        req.flash('erorr', 'silahkan login terlebih dahulu');
        res.redirect('/blog');
        return
    }
    res.render('login');
}

async function login(req, res) {
    try {

        const query = `
        SELECT * FROM user
        WHERE
        email = '${req.body.email}'
        AND
        password = '${req.body.password}'
        `
        const existuser = await db.query(query, {
            type: QueryTypes.SELECT,
        })

        if (existuser.length == 0) {
            req.flash('erorr', 'login gagal')
            res.redirect('/login')
            return
        }

        req.session.user = existuser[0];
        req.session.isLogin = true;

        req.flash('success', 'login berhasil');
        res.redirect('/blog');

    } catch (error) {
        console.log(error);

        res.redirect('/login');
    }
    
}

function renderRegister(req, res) {
    console.log(req.session);
    
        const isLogin = req.session.isLogin;
    if (isLogin) {
        req.flash('erorr', 'silahkan login terlebih dahulu');
        res.redirect('/blog');
        return
    }
    
    res.render('register');
}

async function register(req, res) {
    try {

        const query = `
        INSERT INTO user
        (fullname, email, password)
        VALUES
        ('${req.body.fullname}', '${req.body.email}', '${req.body.password}')
        `

        await db.query(query, { type: QueryTypes.INSERT });
        console.log('Sukses Register');
        
        req.flash('success', 'register berjalan');
        res.redirect('/register');
    } catch (error) {
        console.log('erorr', error);
        
    }   
}

function logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
}

//akhir routing

app.listen(port, () => {
    console.log(`Server Sedang Berjalan ${port}`);
});

function getDateTime() {
    const date = new Date();
    return date.toISOString().slice(0, 19).replace('T', ' ');
}