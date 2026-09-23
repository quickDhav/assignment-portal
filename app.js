const express = require('express');
const pool = require('./db');

const app = express();

app.use(express.json());

const PORT = 3000;

// POST /assignments - Create a new assignment
app.post('/assignments', async (req, res) => {
    try {
        const { title, deadline } = req.body;
        const result = await pool.query(
            'INSERT INTO assignments (title, deadline) VALUES ($1, $2) RETURNING *',
            [title, deadline]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /assignments - Get all assignments (supports ?submitted=true filter) [tested]
app.get('/assignments', async (req, res) => {
    try {
        const { submitted } = req.query;

        if (submitted !== undefined) {
            if (submitted !== 'true' && submitted !== 'false') {
                return res.status(400).json({ message: 'Invalid value for submitted. Use true or false.' });
            }
            const submittedBool = submitted === 'true';
            const result = await pool.query(
                'SELECT * FROM assignments WHERE submitted = $1 ORDER BY id DESC',
                [submittedBool]
            );
            return res.json(result.rows);
        }

        const result = await pool.query('SELECT * FROM assignments ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PATCH /assignments/:id - Mark assignment as submitted [tested]
app.patch('/assignments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'UPDATE assignments SET submitted = true WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /assignments/:id - Delete an assignment [tested]
app.delete('/assignments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM assignments WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.json({
            message: 'Assignment deleted successfully',
            assignment: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
