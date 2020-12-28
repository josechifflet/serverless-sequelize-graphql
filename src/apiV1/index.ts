import {Response, Request, Router} from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response): void => {
  // add controller
  res.status(200);
	res.send('<p>200 AVAILABLE</p>');
	res.end();
});

export default router;
