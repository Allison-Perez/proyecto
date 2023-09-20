const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'instructor', 'src', 'assets')));
app.use(bodyParser.urlencoded({ extended: false }));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'acanner1'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'instructor', 'src', 'app', 'views'));


//Mostrar blogs
app.get('/blog', (req, res) => {
    db.query('SELECT * FROM blog_posts', (err, results) => {
        if (err) {
            console.error('Error fetching blog posts:', err);
            return;
        }
        res.render('blog/index', { blogPosts: results });
    });
});


//Crear Blogs
app.get('/blog/create', (req, res) => {
    res.render('blog/create');
});

app.post('/blog/create', (req, res) => {
    const { title, content } = req.body;
    const post = { title, content };

    db.query('INSERT INTO blog_posts SET ?', post, err => {
        if (err) {
            console.error('Error creating blog post:', err);
            return;
        }
        res.redirect('/blog');
    });
});

//Editar Blogs
app.get('/blog/edit/:id', (req, res) => {
    const postId = req.params.id;
    db.query('SELECT * FROM blog_posts WHERE id = ?', postId, (err, result) => {
        if (err) {
            console.error('Error fetching post to edit:', err);
            return;
        }
        res.render('blog/edit', { post: result[0] });
    });
});

app.post('/blog/edit/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    db.query('UPDATE blog_posts SET title = ?, content = ? WHERE id = ?', [title, content, postId], err => {
        if (err) {
            console.error('Error updating post:', err);
            return;
        }
        res.redirect('/blog');
    });
});


//Eliminar Blogs
app.get('/blog/delete/:id', (req, res) => {
    const postId = req.params.id;
    db.query('DELETE FROM blog_posts WHERE id = ?', postId, err => {
        if (err) {
            console.error('Error deleting post:', err);
            return;
        }
        res.redirect('/blog');
    });
});

//Mostrar Perfil
app.get('/perfil', (req, res) => {
    const profile = {
        name: 'Nombre del Usuario',
        ficha: 'Número de Ficha',
        description: 'Descripción del perfil'
    };

    res.render('perfil/index', { profile });
});


app.get('/perfil/:id/edit', (req, res) => {
    const perfilId = req.params.id;
    db.query('SELECT * FROM usuarios WHERE id = ?', perfilId, (err, result) => {
        if (err) {
            console.error('Error fetching profile for edit:', err);
            return;
        }
        const profile = obtenerPerfilDesdeLaBaseDeDatos(perfilId);
        res.render('perfil/edit', { profile });
    });
});


app.post('/perfil/:id/edit', (req, res) => {
    const perfilId = req.params.id;
    const { name, ficha, description, email, phone } = req.body;
    db.query('UPDATE usuarios SET primer_nombre = ?, numero_ficha = ?, description = ?, correo = ?, telefono = ? WHERE id = ?', 
        [name, ficha, description, email, phone, perfilId], err => {
        if (err) {
            console.error('Error updating profile:', err);
            return;
        }
        res.redirect('/perfil/' + perfilId);
    });
});

//Mostrar Guias
app.get('/guias', (req, res) => {
    db.query('SELECT * FROM guias', (err, results) => {
        if (err) {
            console.error('Error fetching guias:', err);
            return;
        }
        res.render('guias/index', { guias: results });
    });
});

//Crear Guias
app.get('/guias/create', (req, res) => {
    res.render('guias/create');
});

app.post('/guias/create', (req, res) => {
    const { title, content } = req.body;
    const guia = { title, content };

    db.query('INSERT INTO guias SET ?', guia, err => {
        if (err) {
            console.error('Error creating guia:', err);
            return;
        }
        res.redirect('/guias');
    });
});



//Editar Guias
app.get('/guias/edit/:id', (req, res) => {
    const guiaId = req.params.id;
    db.query('SELECT * FROM guias WHERE id = ?', guiaId, (err, result) => {
        if (err) {
            console.error('Error fetching guia to edit:', err);
            return;
        }
        res.render('guias/edit', { guia: result[0] });
    });
});

app.post('/guias/edit/:id', (req, res) => {
    const guiaId = req.params.id;
    const { title, content } = req.body;
    db.query('UPDATE guias SET title = ?, content = ? WHERE id = ?', [title, content, guiaId], err => {
        if (err) {
            console.error('Error updating guia:', err);
            return;
        }
        res.redirect('/guias');
    });
});


//Eliminar Guias
app.get('/guias/delete/:id', (req, res) => {
    const guiaId = req.params.id;
    db.query('DELETE FROM guias WHERE id = ?', guiaId, err => {
        if (err) {
            console.error('Error deleting guia:', err);
            return;
        }
        res.redirect('/guias');
    });
});


app.get('/asistencia', (req, res) => {
    db.query('SELECT * FROM asistencias', (err, results) => {
        if (err) {
            console.error('Error fetching asistencias:', err);
            return;
        }
        res.render('asistencia/index', { asistencias: results });
    });
});


app.get('/asistencia/create', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, usuarios) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener usuarios');
        } else {
            res.render('asistencia/create', { usuarios: usuarios });
        }
    });
});

app.post('/asistencia/create', (req, res) => {
    const { usuarioId, fecha, estado } = req.body;
    const asistencia = { usuarioId, fecha, estado };

    db.query('INSERT INTO asistencias SET Id = ?, fecha = ?, estado = ?', [usuarioId, fecha, estado], err => {
    if (err) {
        console.error('Error creating asistencia:', err);
        return;
    }
    res.redirect('/asistencia');
});

});


app.get('/asistencia/edit/:id', (req, res) => {
    const asistenciaId = req.params.id;
    db.query('SELECT * FROM asistencias WHERE id = ?', asistenciaId, (err, result) => {
        if (err) {
            console.error('Error fetching asistencia to edit:', err);
            return;
        }
        db.query('SELECT * FROM usuarios', (err, usuarios) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al obtener usuarios');
            } else {
                res.render('asistencia/edit', { asistencia: result[0], usuarios: usuarios });
            }
        });
    });
});


app.post('/asistencia/edit/:id', (req, res) => {
    const asistenciaId = req.params.id;
    const { fecha, estado } = req.body;
    db.query('UPDATE asistencias SET fecha = ?, estado = ? WHERE id = ?', [fecha, estado, asistenciaId], err => {
        if (err) {
            console.error('Error updating asistencia:', err);
            return;
        }
        res.redirect('/asistencia');
    });
});


app.get('/asistencia/delete/:id', (req, res) => {
    const asistenciaId = req.params.id;
    db.query('DELETE FROM asistencias WHERE id = ?', asistenciaId, err => {
        if (err) {
            console.error('Error deleting asistencia:', err);
            return;
        }
        res.redirect('/asistencia');
    });
});



app.get('/horarios', (req, res) => {
    db.query('SELECT * FROM horarios', (err, results) => {
        if (err) {
            console.error('Error fetching horarios:', err);
            return;
        }
        res.render('horarios/index', { horarios: results });
    });
});

app.get('/horarios/create', (req, res) => {
    res.render('horarios/create');
});

app.post('/horarios/create', (req, res) => {
    const { dia, hora_inicio, hora_fin } = req.body;
    const horario = { dia, hora_inicio, hora_fin };

    db.query('INSERT INTO horarios SET ?', horario, err => {
        if (err) {
            console.error('Error creating horario:', err);
            return;
        }
        res.redirect('/horarios');
    });
});

app.get('/horarios/edit/:id', (req, res) => {
    const horarioId = req.params.id;
    db.query('SELECT * FROM horarios WHERE id = ?', horarioId, (err, result) => {
        if (err) {
            console.error('Error fetching horario to edit:', err);
            return;
        }
        res.render('horarios/edit', { horario: result[0] });
    });
});

app.post('/horarios/edit/:id', (req, res) => {
    const horarioId = req.params.id;
    const { dia, hora_inicio, hora_fin } = req.body;
    db.query('UPDATE horarios SET dia = ?, hora_inicio = ?, hora_fin = ? WHERE id = ?', 
        [dia, hora_inicio, hora_fin, horarioId], err => {
        if (err) {
            console.error('Error updating horario:', err);
            return;
        }
        res.redirect('/horarios');
    });
});

app.get('/horarios/delete/:id', (req, res) => {
    const horarioId = req.params.id;
    db.query('DELETE FROM horarios WHERE id = ?', horarioId, err => {
        if (err) {
            console.error('Error deleting horario:', err);
            return;
        }
        res.redirect('/horarios');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


