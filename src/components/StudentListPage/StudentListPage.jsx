import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  //FaUser,
  //FaStar,
  //FaClock,
  //FaBan,
  //FaCircle,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import * as S from "./StudentListPage.style";
import { useSelector } from "react-redux";

const StudentListPage = () => {
  const [student, setStudent] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  //const [activeMenu, setActiveMenu] = useState(null);
  const [expandedCohortIds, setExpandedCohortIds] = React.useState({});
  const [fetchCohortDetails] = useState([]);
  const localAddress = useSelector((state) => state.localAddress.value);

  const imgUrl =
    "https://kostamanagebucket.s3.ap-northeast-2.amazonaws.com/kostamanageImage/";
  const { id } = useParams();
  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const JWT_Token =
          "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLthYzsiqTtirjtmozsm5AwMCIsImlhdCI6MTcyMDU3NDU5NSwiZXhwIjoxNzIwNjEwNTk1fQ.ZOxkZW_Peos1ERtoKolZAAADURQOsfmFJJKhgtiK4K8DS5p9fQgXkEFnkiwVgQ1Q4mVPdeO4Qb--xUCSuHv4gQ";
        const { data } = await axios.get(
          `${localAddress}cohorts/all`
          //{
          //	headers: {
          //		Authorization: `Bearer ${JWT_Token}`,
          //	},
          //}
        );
        if (Array.isArray(data)) {
          setCohorts(data);
        } else {
          console.error("Cohort is not in an array format.");
        }
      } catch (error) {
        console.error("Error fetching cohort data", error);
      }
    };

    const fetchStudent = async (studentId) => {
      try {
        const { data } = await axios.get(`${localAddress}users/all`);
        console.log(data);

        const studentData = {
          userId: data.id,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
          cohortId: data.cohortId,
          assignedCohort: data.assignedCohort,
          approvalStatus: data.approvalStatus,
          profileImg: data.profileImg,
          address: data.address,
          notes: data.notes,
        };
        setStudent([studentData]);
      } catch (error) {
        console.error("Error fetching student data", error);
      }
    };

    const fetchData = async () => {
      await fetchCohorts();
      //if (id) {
      await fetchStudent(id);
      //}
    };

    fetchData();
  }, [id]); // id만을 의존성으로 설정

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleCohortClick = async (cohort) => {
    try {
      setExpandedCohortIds((prevState) => ({
        ...prevState,
        [cohort.id]: !prevState[cohort.id],
      }));

      const cohortDetails = await fetchCohortDetails(cohort.id);
      if (cohortDetails) {
        console.log("Clicked Cohort ID:", cohort.id);
        console.log("Cohort Details:", cohortDetails);
        // Update the state or display the cohort details as needed
      } else {
        console.log("Failed to fetch cohort details");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //const handleMenuClick = (menuItem) => {
  //	setActiveMenu(activeMenu === menuItem ? null : menuItem);
  //};

  return (
    <S.Container>
      <S.Sidebar>
        {cohorts.map((cohort) => (
          <div key={cohort.id}>
            <div
              onClick={() => handleCohortClick(cohort.id)}
              style={{ cursor: "pointer" }}
            >
              <span style={{ marginRight: "10px" }}>
                [{cohort.cohortNumber}기]
              </span>
              <span>[{cohort.branchLocation}]</span>
              <span>{cohort.branchName}</span>
            </div>
            {expandedCohortIds[cohort.id] && (
              <div>
                <h3>교육 기수</h3>
                {student
                  .filter((student) => student.cohortId === cohort.id)
                  .map((student) => (
                    <div key={student.userId}>
                      <p>{student.name}</p>
                      <p>{student.phoneNumber}</p>
                      <p>{student.email}</p>
                      <p>{student.address}</p>
                      <p>{student.notes}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
        {/*<S.Button>새로 추가</S.Button>*/}
        {/*<S.MenuItem
					style={{ fontWeight: activeMenu === "교육 기수" ? "bold" : "normal" }}
					onClick={() => handleMenuClick("교육 기수")}
					selected={activeMenu === "교육 기수"}
				>
					<FaUser />
					<S.MenuText active={activeMenu === "교육 기수"}>교육 기수</S.MenuText>
				</S.MenuItem>
				{activeMenu === "교육 기수" && (
					<>
						<S.SubMenuItem>Sub Item 1</S.SubMenuItem>
						<S.SubMenuItem>Sub Item 2</S.SubMenuItem>
					</>
				)}
				<Link to="/student-list"></Link>
				{cohorts.map((cohort) => (
					<div key={cohort.id}>
						<div
							onClick={() => handleCohortClick(cohort)}
							style={{ cursor: "pointer" }}
						>
							<p>{cohort.name}</p>
						</div>
						{expandedCohortIds[cohort.id] && (
							<div>
								<h3>교육 기수</h3>
								{students
									.filter((student) => student.cohortId === cohort.id)
									.map((student) => (
										<div key={student.id}>
											<p>{student.name}</p>
											<p>{student.phoneNumber}</p>
											<p>{student.email}</p>
											<p>{student.address}</p>
											<p>{student.notes}</p>
										</div>
									))}
							</div>
						)}
					</div>
				))}
				<S.MenuItem
					style={{ fontWeight: activeMenu === "즐겨찾기" ? "bold" : "normal" }}
					onClick={() => handleMenuClick("즐겨찾기")}
					selected={activeMenu === "즐겨찾기"}
				>
					<FaStar />
					<S.MenuText active={activeMenu === "즐겨찾기"}>즐겨찾기</S.MenuText>
				</S.MenuItem>
				{activeMenu === "즐겨찾기" && (
					<>
						<S.SubMenuItem>Sub Item 1</S.SubMenuItem>
						<S.SubMenuItem>Sub Item 2</S.SubMenuItem>
					</>
				)}
				<Link to="/student-list/starred"></Link>
				<S.MenuItem
					style={{ fontWeight: activeMenu === "최근 목록" ? "bold" : "normal" }}
					onClick={() => handleMenuClick("최근 목록")}
					selected={activeMenu === "최근 목록"}
				>
					<FaClock />
					<S.MenuText active={activeMenu === "최근 목록"}>최근 목록</S.MenuText>
				</S.MenuItem>
				{activeMenu === "최근 목록" && (
					<>
						<S.SubMenuItem>Sub Item 1</S.SubMenuItem>
						<S.SubMenuItem>Sub Item 2</S.SubMenuItem>
					</>
				)}
				<Link to="/student-list/pending"></Link>
				<S.MenuItem
					style={{ fontWeight: activeMenu === "차단 목록" ? "bold" : "normal" }}
					onClick={() => handleMenuClick("차단 목록")}
					selected={activeMenu === "차단 목록"}
				>
					<FaBan />
					<S.MenuText active={activeMenu === "차단 목록"}>차단 목록</S.MenuText>
				</S.MenuItem>
				{activeMenu === "차단 목록" && (
					<>
						<S.SubMenuItem>Sub Item 1</S.SubMenuItem>
						<S.SubMenuItem>Sub Item 2</S.SubMenuItem>
					</>
				)}
				<Link to="/student-list/blocked"></Link>*/}
        {/*<S.CategoryTitle>카테고리</S.CategoryTitle>
				<Link to="/student-list/engineers">
					<S.CategoryItem>
						<FaCircle style={{ color: "#4a90e2" }} />
						개발자
					</S.CategoryItem>
				</Link>
				<Link to="/student-list/support">
					<S.CategoryItem>
						<FaCircle style={{ color: "#f5a623" }} />
						연구원
					</S.CategoryItem>
				</Link>
				<Link to="/student-list/sales">
					<S.CategoryItem>
						<FaCircle style={{ color: "#7ed321" }} />
						강사
					</S.CategoryItem>
				</Link>*/}
      </S.Sidebar>
      <S.MainContent>
        <S.HeaderWrap>
          <S.SearchWrapper>
            <S.Search
              placeholder="이름, 이메일 검색"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </S.SearchWrapper>
        </S.HeaderWrap>
        <S.Content>
          <S.StudentList>
            {student
              .filter(
                (student) =>
                  (student.name &&
                    student.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())) ||
                  (student.email &&
                    student.email
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()))
              )
              .map((student) => (
                <S.StudentItem
                  key={student.userId}
                  onClick={() => handleStudentClick(student)}
                >
                  <img src={`${imgUrl}${student.profileImg}`} alt="Profile" />
                  <S.StudentInfo>
                    <S.StudentName>{student.name}</S.StudentName>
                    <S.StudentEmail>{student.email}</S.StudentEmail>
                  </S.StudentInfo>
                </S.StudentItem>
              ))}
          </S.StudentList>
          {selectedStudent && (
            <S.DetailPanel>
              <S.Details>
                <S.ContactDetails>
                  <S.DetailsHeader>
                    <S.DetailsAvatar
                      src={`https://i.pravatar.cc/150?img=${selectedStudent.userId}`}
                      alt={selectedStudent.name}
                    />
                    <div>
                      <S.ContactTitle>{selectedStudent.name}</S.ContactTitle>
                      <S.ContactSubtitle>
                        {selectedStudent.role}
                      </S.ContactSubtitle>
                    </div>
                  </S.DetailsHeader>
                  <S.DetailsBody>
                    <S.ContactInfo>
                      <S.ContactInfoItem>
                        <S.ContactLabel>Phone number:</S.ContactLabel>
                        <S.ContactValue>
                          {selectedStudent.phoneNumber}
                        </S.ContactValue>
                      </S.ContactInfoItem>
                      <S.ContactInfoItem>
                        <S.ContactLabel>Email address:</S.ContactLabel>
                        <S.ContactValue>{selectedStudent.email}</S.ContactValue>
                      </S.ContactInfoItem>
                      <S.ContactInfoItem>
                        <S.ContactLabel>Address:</S.ContactLabel>
                        <S.ContactValue>
                          {selectedStudent.address}
                        </S.ContactValue>
                      </S.ContactInfoItem>
                      <S.ContactInfoItem>
                        <S.ContactLabel>Company:</S.ContactLabel>
                        <S.ContactValue>
                          {selectedStudent.assignedCohort}
                        </S.ContactValue>
                      </S.ContactInfoItem>
                      <S.ContactInfoItem>
                        <S.ContactLabel>Notes:</S.ContactLabel>
                        <S.ContactValue>{selectedStudent.notes}</S.ContactValue>
                      </S.ContactInfoItem>
                    </S.ContactInfo>
                  </S.DetailsBody>
                  <S.DetailsButtons>
                    <S.EditButton>
                      <FaEdit /> Edit
                    </S.EditButton>
                    <S.DeleteButton>
                      <FaTrashAlt /> Delete
                    </S.DeleteButton>
                  </S.DetailsButtons>
                </S.ContactDetails>
              </S.Details>
            </S.DetailPanel>
          )}
        </S.Content>
      </S.MainContent>
    </S.Container>
  );
};

export default StudentListPage;