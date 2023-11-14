<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@page import="com.sayproject.model.Members.Member"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<jsp:include page="/WEB-INF/views/include/LoginSessionCheck.jsp" />
<!DOCTYPE html>
<html lang="en">
<head>
<!-- Bootstrap core CSS -->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<title>HealthCare | SAYPROJECT</title>
<jsp:include page="/WEB-INF/views/include/header_css.jsp" />
<!-- Custom Theme Style -->
<link href="assets/Members/css/custom.css" rel="stylesheet" />
</head>

<body class="nav-md">
	<div class="container body">
		<div class="main_container">
			<!-- left side menu -->
			<div class="col-md-3 left_col">
				<jsp:include page="/WEB-INF/views/include/side_left.jsp" />
			</div>
			<!-- /left side menu -->
			<!-- top navigation -->
			<div class="top_nav">
				<jsp:include page="/WEB-INF/views/include/top_nav.jsp" />
			</div>
			<!-- /top navigation -->

			<!-- page content -->
			<div class="right_col" role="main">
				<div class="">
					<div class="page-title">
						<div class="title_left">
							<h3></h3>
						</div>
						<div class="title_right">
							<div class="col-md-5 col-sm-5 form-group pull-right top_search">
								<div class="input-group">
									<input type="text" class="form-control"
										placeholder="Search for..." /> <span class="input-group-btn">
										<button class="btn btn-default" type="button">Go!</button>
									</span>
								</div>
							</div>
						</div>
					</div>

					<div class="clearfix"></div>

					<div class="row">
						<div class="col-md-12 col-sm-12">
							<!-- main content -->
							<%
							/* 기본적으로 메인 컨텐츠는 이 곳에 입력합니다. */
							%>

							<div class="x_panel">
								<div class="x_title">
									<h2>
										Table design <small>회원 명수 : ${memberList.size()} 명</small>
									</h2>
									<ul class="nav navbar-right panel_toolbox">
										<li><a class="collapse-link"><i
												class="fa fa-chevron-up"></i></a></li>
										<li class="dropdown"><a href="#" class="dropdown-toggle"
											data-toggle="dropdown" role="button" aria-expanded="false"><i
												class="fa fa-wrench"></i></a>
											<div class="dropdown-menu"
												aria-labelledby="dropdownMenuButton">
												<a class="dropdown-item" href="#">Settings 1</a> <a
													class="dropdown-item" href="#">Settings 2</a>
											</div></li>
										<li><a class="close-link"><i class="fa fa-close"></i></a>
										</li>
									</ul>
									<div class="clearfix"></div>
								</div>

								<div class="x_content">
									<div class="table-responsive">
										<table class="table table-striped jambo_table">
											<thead>
												<tr class="headings">
													<th class="column-title" rowspan="2">사진</th>
													<th class="column-title">카카오</th>
													<th class="column-title">이름</th>
													<th class="column-title">나이</th>
													<th class="column-title">성별</th>
													<th class="column-title">몸무게</th>
													<th class="column-title">키</th>
													<th class="column-title">등록일</th>
													<th class="column-title no-link last" rowspan="2"><span
														class="nobr">이동</span></th>
												</tr>
												<tr>
													<td class=" ">회원번호</td>
													<td class=" ">담당</td>
													<td class=" ">직업</td>
													<td class=" " colspan="2">주소</td>
													<td class=" " colspan="2">연락처</td>
												</tr>
											</thead>

											<tbody>
												<c:forEach var="member" items="${memberList}">
													<tr class="pointer">
														<td class=" " rowspan="2"><img
															src="${member.getPhotopath()}" width="100px"
															height="100px"></td>
														<td class=" ">${member.getKakao_id()}</td>
														<td class=" ">${member.getName()}</td>
														<td class=" ">${member.getAge()}</td>
														<td class=" ">${member.getGender()}</td>
														<td class="a-right a-right">${member.getWeight()}</td>
														<td class="a-right a-right">${member.getHeight()}</td>
														<td class=" ">${member.getRegist_day()}</td>
														<td class="last" rowspan="2"><a href="#">이동</a></td>
													</tr>
													<tr class="pointer">
														<td class=" ">${member.getNo()}</td>
														<td class=" ">${member.getTrainer()}</td>
														<td class=" ">${member.getJob()}</td>
														<td class=" " colspan="2">${member.getAddress()}</td>
														<td class=" " colspan="2">${member.getPhone_number()}</td>
													</tr>
												</c:forEach>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<!-- /main content -->
						</div>
					</div>
				</div>
			</div>
			<!-- /page content -->

			<!-- footer content -->
			<footer>
				<div class="pull-right">S A Y P R O J E C T</div>
				<div class="clearfix"></div>
			</footer>
			<!-- /footer content -->
		</div>
	</div>
	<jsp:include page="/WEB-INF/views/include/footer_script.jsp" />
	<!-- Custom Theme Scripts -->
<script src="assets/Members/js/custom.js"></script>
</body>
</html>