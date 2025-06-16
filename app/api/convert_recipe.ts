export default function POST(req: Request, res: Response){
    const inputs = req.body;
    console.log("convert recipe inputs are", inputs)
    return res.json()
}