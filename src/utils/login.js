import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFail,
} from "./../redux/actions/userLoginSession";

/** 로그인 핸들러 */
export const handleLogin = async (
  getUserName,
  getUserPassword,
  dispatch,
  localAddress
) => {
  dispatch(loginStart());

  try {
    const response = await axios.post(`${localAddress}auth/login`, {
      name: getUserName,
      password: getUserPassword,
    });

    const token = response.data;

    // 키 값을 Base64로 인코딩
    const encodedKey = btoa("jwtToken");

    // 토큰을 로컬 스토리지에 저장
    localStorage.setItem(encodedKey, token);

    // 사용자 정보 요청
    const userResponse = await axios.get(
      `${localAddress}users/name/${getUserName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const isAdmin =
      userResponse.data.role === "Admin" ||
      userResponse.data.role === "Researcher";

    dispatch(
      loginSuccess({
        checkUserName: getUserName,
        token: token,
        userInfo: userResponse.data,
        isAdmin: isAdmin,
      })
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(loginFail(error.response.data));
    } else {
      dispatch(loginFail("로그인 실패"));
    }
  }
};
