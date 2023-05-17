/*
1.Given stutus 200;
2. Return token;
3. Return object "user" with two fields "email" and "subscription" with the "string" data type; 
*/

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("..//app");
const { login, register } = require("..//controllers/auth");
const { HttpError } = require("..//helpers/HttpError");
// const {DB_HOST} = process.env;

require("dotenv").config();

// const {User} = require('../models/user');
const { SECRET_KEY } = process.env;

const User = {
  _id: "64557fef63d073d5cdea299a",
  password: "$2b$10$4ZDoMVxKcvH6ey8PhR40MepkokG8bdeMf3POgu6rz3ury5YLVbbI6",
  email: "meshechek.vitaliy@ukr.net",
  subscription: "pro",
  avatarUrl: "//www.gravatar.com/avatar/4c2ac3134c879ca6447c34aa6aba803a",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NTU3ZmVmNjNkMDczZDVjZ…",
};
// app.post('/api/users/login', login)
// app.post('/api/users/register', register)

// const user = {
//     email: "meshechek.vitaliy@ukr.net",
//     password: "123456789"
// }

const userRegister = {
  email: "meshechek.vitaliy@ukr.net",
  password: "123456789",
  subscription: "pro",
};

describe("testing the controllers autorization", () => {
  describe("test for login controller", () => {
    // test("return 201 status for registration", () => {
    //     const response = request(app).post("/api/users/register").send(userRegister)
    //     // console.log(response.data)
    //     // const findEmail =  jest.spyOn(User, 'findOne').mockImplementationOnce(() => userRegister.email);
    //     // expect(findEmail.email).toBe(true);
    //     expect(response.status).toBe(201);
    //     expect(typeof userRegister.email).toBe("string");
    //     expect(typeof userRegister.subscription).toBe("string");
    //   });
    test("sending a login request and return 200 status ", () => {
      // const user = {
      //   password: "123456789",
      //   email: "meshechek.vitaliy@ukr.net",
      // }
      const response = request(app).post("/api/users/login").send({
        password: "123456789",
        email: "meshechek.vitaliy@ukr.net",
      });
      const user = jest
        .spyOn(User, "findOne")
        .mockImplementationOnce(() => user.email);
      const payload = {
        id: user._id,
      };
      const token = jwt.sign(payload, SECRET_KEY);
      User.token = token;
      //   const mReq = {email: mUser.email, password: mUser.password}
      //   const mRes = {token}
      // const findEmail = await jest.spyOn(User, 'findOne').mockImplementationOnce(() => mUser.email);
      //   const findEmail = await jest.spyOn(User, 'findOne').mockImplementationOnce(() => mReq.email)
      //   if (!findEmail) {
      //     throw HttpError(401, "Email or password is wrong");
      // }
      // const mockNext = jest.fn();

      // const result = login(mReq, mRes)

      //  console.log(result)
      expect(response.status).toBe(200);
      // expect(result.email).toBe("meshechek.vitaliy@ukr.net");
      // expect(result.password).toBe("123456789");
      expect(token).toBe("string");
      expect(user.password).toBe("string");
      expect(user.email).toBe("string");
      expect(user.subscription).toBe("string");

      // expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
