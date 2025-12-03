import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send( { title: 'GET All Subscriptions'}));
subscriptionRouter.get('/:id', (req, res) => res.send( { title: 'GET Subscriptions'}));
subscriptionRouter.post('/', (req, res) => res.send( { title: 'CREATE Subscriptions'}));
subscriptionRouter.put('/:id', (req, res) => res.send( { title: 'UPDATE Subscriptions'}));
subscriptionRouter.delete('/:id', (req, res) => res.send( { title: 'DELETE Subscriptions'}));
subscriptionRouter.get('/user/:id', (req, res) => res.send( { title: 'GET All Users Subscriptions'}));
subscriptionRouter.put('/:id/cancel', (req, res) => res.send( { title: 'CANCEL All Subscriptions'}));
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send( { title: 'GET Upcoming Subscriptions'}));


export default subscriptionRouter;