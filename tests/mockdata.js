const validUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Password@123',
    age: '30',
    gender: 'male',
    photoUrl: 'https://example.com/photo.jpg',
    about: 'Test user',
    skills: ['JavaScript', 'Node.js']
  };
  
  const invalidUser = {
    firstName: 'J',
    lastName: 'D',
    email: 'invalid-email',
    password: 'weak',
    age: '10',
    gender: 'invalid',
    photoUrl: 'not-a-url',
    about: 'x'.repeat(301),
    skills: Array(21).fill('skill')
  };
  
  module.exports = { validUser, invalidUser };