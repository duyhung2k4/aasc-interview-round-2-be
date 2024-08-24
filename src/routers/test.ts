import { Request, Response, Router } from "express";

const testRouter = Router();

testRouter.get("/ping", (req: Request, res: Response) => {
    res.status(200).json({
        mess: "done",
    })
})

export default testRouter;