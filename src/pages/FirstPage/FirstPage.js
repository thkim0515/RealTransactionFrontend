import React from "react";

import * as S from "./FirstPage.style";
import ContactList from "../../components/StudentListPage/ContactList";
import StudentListPage from "../../components/StudentListPage/StudentListPage";

const FirstPage = () => {
	const count = useSelector((state) => state.counter.count);
	const user = useSelector((state) => state.user.user);

  return (
    <>
      <S.Container>
        <h1>{count}</h1>
        <div>페이지1</div>
        <h1>{user}</h1>
        <br />
        {/* <SignUp /> */}
      </S.Container>
    </>
  );
};
export default FirstPage;
