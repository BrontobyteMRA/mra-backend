
export async function login(req, res) {
    const { username, password } = req.body;
    const user = await findOne({ username, password });
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
    res.json({ message: 'Login successful', user });
}

export async function signup(req, res) {
    const { username, password, role } = req.body;
    try {
        const newUser = await create({ username, password, role });
        res.status(201).json(newUser);
    } catch (err) {
        console.log(err);
        res.status(400).send('Error creating user');
    }
}
