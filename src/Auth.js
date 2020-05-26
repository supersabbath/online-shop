// Simulate authentication service

import "firebase/auth";

const Auth = {
  authenticate: async (name, pass)  => {

  },

  signout(cb) {
    this._isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

export default Auth;
