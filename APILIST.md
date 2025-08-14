# profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // forgot password api

# connectionRequestRouter

- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:requestId
- POST /request/send/rejected/:requestId

# userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feed
