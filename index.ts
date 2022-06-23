import express, {Request, Response} from "express"
import {PrismaClient} from '@prisma/client'
import { Resolver } from "dns"

const app = express()
const PORT = 2030
const prisma = new PrismaClient()

// middleware
app.use(express.json())


app.get('/status', (req: Request, res: Response)=>{
    return res.status(200).json('ORM health care working okay')
});

// create user
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

// get all user
app.get('/', async (_req: Request, res: Response) => {
    const findUser = await prisma.user.findMany()

    if (!findUser){
        return res.status(400).json({
            msg: 'Somthing went wrong'
        })
    }
    else if (findUser == null){
        return res.status(200).json({
            msg: 'No users at the moment'
        })  
    }
    return res.status(200).json({
        findUser
    });
});

// update user
app.put('/update-profile', async (req: Request, res: Response) => {
    const {id, username} = req.body

    const updateUser = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            username: username
        }
    });
    if (!updateUser){
        return res.status(400).json({
            msg: 'Error... something went wrong'
        })
    }
    return res.status(201).json({
        success: {
            id, 
            username
        }
    });
});


// delete user
app.delete('/delete/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    const deleteUser = await prisma.user.delete({
        where: {
            id : Number(id)
        }
    });
    if (!deleteUser){
        return res.status(400).json({
            msg: 'Error... something went wrong'
        })
    }
    return res.status(200).json({
        msg: `user ${id} was deleted successfully`
    })
})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})