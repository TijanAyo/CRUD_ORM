import express, {Request, Response} from "express"
import {PrismaClient} from '@prisma/client'

const app = express()
const PORT = 2030
const prisma = new PrismaClient()

// middleware
app.use(express.json())


app.get('/status', (_req: Request, res: Response)=>{
    const { statusCode } = res;
    if (statusCode != 200){
        return res.status(400).json({msg: "Something went wrong..."})
    }
    return res.status(200).json({msg: 'Working okay...'})
});

// Create User
app.post('/', async (req: Request, res: Response) => {
    const {username , password } = req.body

    if (!username || !password){
        return res.status(400).json({
            msg: 'No field was specified'
        });
    }

    const newUser = await prisma.user.create({
        data: {
            username: username,
            password: password
        }
    });

    if (newUser){
        return res.status(201).json('New user created')
    }
    return res.status(400).json({
        msg: 'Something went wrong'
    })
});

// Get All User's
app.get('/', async (_req: Request, res: Response) => {
    const user = await prisma.user.findMany()

    if (user){
        return res.status(200).json({user});
    }
    return res.status(400).json({
        msg: 'No user at this time...'
    });
    
});

// Get Single User
app.get('/:id',async (req: Request, res: Response) => {
    const id = req.params.id

    const user = await prisma.user.findUnique({
        where: {
            id: Number(id)
        }
    });
    if(user){
        return res.status(200).json(user)
    }
    return res.status(400).send(`No user with ID: ${id}`)
});

// Update User
app.put('/update-profile', async (req: Request, res: Response) => {
    const {id, username} = req.body

    const user = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            username: username
        }
    });
    if (user){
        return res.status(200).send(user)
    }
    return res.status(400).send('Somthing did not go right...')
});


// Delete User
app.delete('/delete/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    const user = await prisma.user.delete({
        where: {
            id : Number(id)
        }
    });
    if (user){
        return res.status(200).json({
            msg: `user ${id} was deleted successfully`
        });
    }
    return res.status(400).json({
        msg: 'Error... something went wrong'
    })
})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})