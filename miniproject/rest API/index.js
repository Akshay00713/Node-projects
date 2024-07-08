const express = require('express');
const bodyParser = require('body-parser');

const app = express();
let users = [
    {
        id: 1,
        usename: "John doe",
        email: "john@john.com",
        password: "password@12"
    },
    {
        id: 2,
        username: "Male",
        email: "male@male.com",
        password: "male@12"
    },
];

let workouts = [
    {
        id: 1,
        userId: 1,
        date: "2024-06-12",
        exercise: "Running",
        duration: 30,
    },
    {
        id: 2,
        userId: 1,
        date: "2024-06-13",
        exercise: "Cycling",
        duration: 45,   
    },
    {
        id: 3,
        userId: 2,
        date: "2024-06-12",
        exercise: "Yoga",
        duration: 60,   
    },
];

app.use(bodyParser.json());

//Creating new route

app.get("/users", (req, res) => {
    res.json(users);
});

//get user data

app.get("/users/:userId", (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users.find(user => user.id === userId)
    if(user){
        res.json(user);
    }
    else{
        res.status(404).json({error: "User not found"});
    }
});

app.get("/workouts", (req, res) => {
    res.json(workouts);
})

app.get("/workouts/:workoutId", (req, res) => {
    const workoutId = parseInt(req.params.workoutId);
    const workout = workouts.find(workout => workout.id === workoutId);
    if(workout){
        res.json(workout);
    } else{
        res.status(404).json({error: "Workout not found"});
    }
});


//post route

app.post("/workouts", (req, res) => {
    const { userId, date, exercise, duration } = req.body;
    if(!userId || !date || !exercise || !duration) {
        return res.status(400).json({error: "Missing equired fields"});
    }
    const workout = {
        id: workouts.length + 1,
        userId,
        date,
        exercise,
        duration
    };
    workouts.push(workout);
    res.status(201).json(workout);
});

app.put('/workouts/:workoutId', (req, res) => {
    const workoutId = parseInt(req.params.workoutId);
    const workoutIndex = workouts.findIndex(workout => workout.id === workoutId);
    if (workoutIndex !== -1) {
        workouts[workoutIndex] = { ...workouts[workoutIndex], ...req.body };
        res.json(workouts[workoutIndex]);
    } else {
        res.status(404).json({ error: 'Workout not found' });
    }
});

app.patch("/workouts/:workoutId", (req, res) => {
    const workoutId = parseInt(req.params.workoutId);
    const workoutIndex = workouts.findIndex(workout => workout.id === workoutId);
    if(workoutIndex !== -1){
        workouts[workoutIndex] = { ...workouts[workoutIndex], ...req.body };
        res.json(workouts[workoutIndex]);
    } else{
        res.status(404).json({error: "Workout not found"});
    }
});

app.delete("/workouts/:workoutsId", (req, res) => {
    const workoutId = parseInt(req.params.workoutId);
    const workoutIndex = workouts.findIndex(workout => workout.id === workoutId);
    if(workoutIndex !== -1){
        workouts.splice(workoutIndex, 1);
        res.status(204).send();
    } else{
        res.status(404).json({ error: 'Workout not found' });
    }
});

app.listen(3000, () => {
    console.log(`Server running at port 3000`)
});