<%@page import="org.json.simple.JSONObject"%>
<%@page import="org.json.simple.parser.JSONParser"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.sayproject.model.Diet.*"%>
<%@ page import="java.io.FileWriter" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page import="com.google.gson.Gson"%>

<%
	Mealtime mealTime = (Mealtime) request.getAttribute("mealTime");
	Gson gson = new Gson();
	
	String meal = gson.toJson(mealTime);
	System.out.print(meal);
%>

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
<link href="assets/Diet/css/custom.css" rel="stylesheet" />
<link href="assets/Diet/css/custom-d.css" rel="stylesheet" />
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
								<div class="page-title">
					<div class="title_left">
						<h3>영양 섭취 정보</h3>
					</div>
				</div>
				<div class="clearfix"></div>
				
					<!-- add food content -->
					<div class="col-md-6 col-sm-12">
						<div class="x_panel">
							<div class="x_title">
								<div class="title_left">
									<h2>아침</h2>
								</div>
								<div class="clearfix"></div>
							</div>

							<div class="x_content">
								<div class="row">
									<div class="col-md-3 col-sm-6">
										<div class="well">
											<h4>칼로리</h4>
											<h4>390cal</h4>
											<h4>10%</h4>
										</div>
									</div>
									<div class="col-md-3 col-sm-6">
										<div class="well">
											<h4>탄수화물</h4>
											<h4>190cal</h4>
											<h4>5%</h4>
										</div>
									</div>
									<div class="col-md-3 col-sm-6">
										<div class="well">
											<h4>단백질</h4>
											<h4>70cal</h4>
											<h4>6%</h4>
										</div>
									</div>
									<div class="col-md-3 col-sm-6">
										<div class="well">
											<h4>지방</h4>
											<h4>30cal</h4>
											<h4>7%</h4>
										</div>
									</div>
								</div>

								<table class="table table-striped projects">
									<tr>
										<td>음식 이름1</td>
										<td>수량1</td>
										<td>단위1</td>
										<td><span class="glyphicon glyphicon-minus" aria-hidden="true"></span> 제외</td>
									</tr>
									<tr>
										<td>음식 이름2</td>
										<td>수량2</td>
										<td>단위2</td>
										<td><span class="glyphicon glyphicon-minus" aria-hidden="true"></span> 제외</td>
									</tr>
								</table>
							</div>
						</div>

						<div class="x_panel">
							<div class="x_title">
								<div class="title_left">
									<h2>점심</h2>
								</div>
								<div class="clearfix"></div>
							</div>
						</div>

						<div class="x_panel">
							<div class="x_title">
								<div class="title_left">
									<h2>저녁</h2>
								</div>
								<div class="clearfix"></div>
							</div>
						</div>
						
						<div class="x_panel">
							<div class="x_title">
								<div class="title_left">
									<h2>간식</h2>
								</div>			
								<div class="clearfix"></div>
							</div>
						</div>
					</div>
					<!-- /add food content -->
					
					<!-- all nutrient content -->
					<div class="col-md-6 col-sm-12">
						<div class="x_panel" style="height: 100vh;">
							<div class="x_title">
								<div class="title_left"><h2>오늘 내가 먹은 영양소는?</h2></div>
								<div class="clearfix"></div>
							</div>
							<div class="all_nutrient">
								<div>칼로리</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>탄수화물</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>단백질</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>식이섬유</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>당분</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>칼륨</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>마그네슘</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>칼슘</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>철</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>비타민C</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>비타민D</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<div>비타민K</div>
								<div class="progress">
									<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
							</div>
							<div class="x_content">

							</div>
						</div>
					</div>
					<!-- /all nutrient content -->

				<div class="clearfix"></div>
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
<script type="text/javascript">
	let mealData = <%=meal%>;
	console.log(mealData);
</script>
<script src="assets/Diet/js/autocomplete.js"></script>
<script src="assets/Diet/js/bootstrap-autocomplete.js"></script>
<script src="assets/Diet/js/index.js"></script>
<script src="assets/Diet/js/mock.js"></script>
<script src="assets/Diet/js/source.js"></script>
<script src="assets/Diet/js/util.js"></script>
<script src="assets/Diet/js/custom.js"></script>
<script src="assets/Diet/js/custom-d.js"></script>

</body>
</html>
