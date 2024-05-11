const testController = {};

// testController.triggerError = function (req, res, next) {
//   next({
//     status: 500, // 500 for internal server error
//     message:
//       "Oh no! The Junior Dev broke the system. Come back later when we have it fixed.",
//   });
// };

testController.triggerError = function (req, res, next) {
  throw new Error();
};

module.exports = testController;
