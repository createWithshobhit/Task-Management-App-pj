const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// GET route for rendering the index page
app.get('/', function (req, res) {
    fs.readdir('./files', function (err, files) {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while reading the files');
        } else {
            res.render('index', { files: files });
        }
    });
});

// GET route for reading a specific file
app.get('/file/:filename', function (req, res) {
    const filePath = `./files/${req.params.filename}`;

    fs.readFile(filePath, 'utf-8', function (err, filedata) {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while reading the file');
        } else {
            res.render('show', { content: filedata, filename: req.params.filename });
        }
    });
});

// POST route for creating a new file
app.post('/create', function (req, res) {
    const title = req.body.title.replace(/\s+/g, ''); // Remove spaces from the title
    const filePath = `./files/${title}.txt`;

    fs.writeFile(filePath, req.body.details, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while writing the file');
        } else {
            res.redirect('/'); // Redirect to the root route after file creation
        }
    });
});

// DELETE route for deleting a task
app.delete('/task/:filename', function (req, res) {
    const filePath = `./files/${req.params.filename}`;

    fs.unlink(filePath, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while deleting the file');
        } else {
            res.redirect('/'); // Redirect to the root route after file deletion
        }
    });
});

// GET route for showing the edit form
app.get('/edit/:filename', function (req, res) {
    const filePath = `./files/${req.params.filename}`;
    fs.readFile(filePath, 'utf-8', function (err, filedata) {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while reading the file');
        } else {
            res.render('edit', { content: filedata, filename: req.params.filename });
        }
    });
});

// PUT route for updating a task
app.put('/task/:filename', function (req, res) {
    const filePath = `./files/${req.params.filename}`;
    const newFileName = req.body.newTitle.replace(/\s+/g, '') + '.txt'; // Sanitizing new filename
    const newContent = req.body.details;

    fs.rename(filePath, `./files/${newFileName}`, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while renaming the file');
        } else {
            fs.writeFile(`./files/${newFileName}`, newContent, function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred while updating the file content');
                } else {
                    res.redirect('/'); // Redirect to the root route after file update
                }
            });
        }
    });
});

app.listen(5000, function () {
    console.log('Server is running on port 5000');
});
