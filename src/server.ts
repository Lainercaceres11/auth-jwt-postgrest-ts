import app from "./app";

const port = process.env.PORT

app.get("/", (req, res)=>{
    res.send("Punto de entrada")
})

app.listen(port, ()=>{
    console.log(`Server corriendo el el puerto ${port}`)
})