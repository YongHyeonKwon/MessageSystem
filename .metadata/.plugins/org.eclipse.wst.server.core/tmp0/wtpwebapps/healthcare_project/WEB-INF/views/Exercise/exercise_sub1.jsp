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
<link href="assets/Exercise/css/custom.css" rel="stylesheet" />
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
							// 기본적으로 메인 컨텐츠는 이 곳에 입력합니다.   
							out.print("exercise main contents");
							%>


							<div class="title_right">

								<!--좌측-->
								<div class="col-md-9">

									<!-- 첫번째줄-->
									<div class="col-md-12">

										<!--첫번째칸-->
										<div class="col-md-3">
											<div class="x_panel tile fixed_height_150 topcard">
												<span class="count_top"><i class="fa fa-user"></i> Total Users</span>
												<div class="count_box">
													<div class="count">35</div>
													<div class="count_iljae">일째</div>
												</div>
												<span class="count_bottom"><i class="green">4% </i> From last Week</span>
											</div>
										</div>

										<div class="col-md-3">
											<div class="x_panel tile fixed_height_150 overflow_hidden topcard">
												주2회
											</div>
										</div>

										<div class="col-md-3">
											<div class="x_panel tile fixed_height_150 overflow_hidden topcard">
												남은 pt횟수 <br> 6/10
											</div>
										</div>

										<div class="col-md-3">
											<div class="x_panel tile fixed_height_150 overflow_hidden topcard">
												맴버쉽 만료일 <br>
												2023.09.27
											</div>
										</div>

									</div>


									<!-- 
			<div class="col-md-12">
				<div class="x_panel tile fixed_height_150 overflow_hidden">
				  <div class="x_title">
					<h2>위에칸</h2>
					<ul class="nav navbar-right panel_toolbox">
					  <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
					  </li>
					  <li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>
						<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<a class="dropdown-item" href="#">Settings 1</a>
							<a class="dropdown-item" href="#">Settings 2</a>
						  </div>
					  </li>
					  <li><a class="close-link"><i class="fa fa-close"></i></a>
					  </li>
					</ul>
					<div class="clearfix"></div>
				  </div>
				  <div class="x_content">
				  </div>
				</div>
			  </div> -->




									<!--두번째칸-->
									<div class="col-md-4 col-sm-4 ">
										<div class="x_panel tile fixed_height_600 overflow_hidden topcard">
											<div class="x_title">
												<h2>오늘의 운동</h2>
												<ul class="nav navbar-right panel_toolbox">
													<li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
													</li>
													<li class="dropdown">
														<a href="#" class="dropdown-toggle" data-toggle="dropdown"
															role="button" aria-expanded="false"><i
																class="fa fa-wrench"></i></a>
														<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
															<a class="dropdown-item" href="#">Settings 1</a>
															<a class="dropdown-item" href="#">Settings 2</a>
														</div>
													</li>
													<li><a class="close-link"><i class="fa fa-close"></i></a>
													</li>
												</ul>
												<div class="clearfix"></div>
											</div>
											<div class="x_content">
												<div class="chart-container">
													<canvas id="doughtnut-chart1"></canvas>
												</div> 

												<table class="" style="width:100%">
													<tr>
									  
													  <th>
														<div class="col-lg-7 col-md-7 col-sm-7 ">
														  <p class="">Device</p>
														</div>
														<div class="col-lg-5 col-md-5 col-sm-5 ">
														  <p class="">Progress</p>
														</div>
													  </th>
													</tr>
													<tr>
													  <td>
														<table class="tile_info">
														  <tr>
															<td>
															  <p><i class="fa fa-square blue"></i>스쿼트 </p>
															</td>
															<td>80kcal</td>
														  </tr>
														  <tr>
															<td>
															  <p><i class="fa fa-square green"></i>팔굽혀펴기
															  </p>
															</td>
															<td>270kcal</td>
														  </tr>
														  <tr>
															<td>
															  <p><i class="fa fa-square purple"></i>줌바댄스
															  </p>
															</td>
															<td>200kcal</td>
														  </tr>
														  <tr>
															<td>
															  <p><i class="fa fa-square aero"></i>라인댄스 </p>
															</td>
															<td>100kcal</td>
														  </tr>
														  <tr>
															<td>
															  <p><i class="fa fa-square red"></i>Others </p>
															</td>
															<td>300kcal</td>
														  </tr>
														</table>
													  </td>
													</tr>
												  </table>




											</div>
										</div>
									</div>

									<!--세번째칸-->
									<div class="col-md-8 col-sm-8 ">
										<div class="x_panel tile fixed_height_287 overflow_hidden topcard">
											<div class="x_title">
												<h2>체중 변화</h2>
												<ul class="nav navbar-right panel_toolbox">
													<li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
													</li>
													<li class="dropdown">
														<a href="#" class="dropdown-toggle" data-toggle="dropdown"
															role="button" aria-expanded="false"><i
																class="fa fa-wrench"></i></a>
														<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
															<a class="dropdown-item" href="#">Settings 1</a>
															<a class="dropdown-item" href="#">Settings 2</a>
														</div>
													</li>
													<li><a class="close-link"><i class="fa fa-close"></i></a>
													</li>
												</ul>
												<div class="clearfix"></div>
											</div>
											<div class="x_content">

												<div class="chart-container">
													<canvas id="line-chart1"></canvas>
												</div> 


											</div>
										</div>
									</div>


									<!--side bar 2 -->


									<!--네번째칸-->
									<div class="col-md-4 col-sm-4 ">
										<div class="x_panel tile fixed_height_287 overflow_hidden topcard">
											<div class="x_title">
												<h2>운동별시간</h2>
												<ul class="nav navbar-right panel_toolbox">
													<li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
													</li>
													<li class="dropdown">
														<a href="#" class="dropdown-toggle" data-toggle="dropdown"
															role="button" aria-expanded="false"><i
																class="fa fa-wrench"></i></a>
														<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
															<a class="dropdown-item" href="#">Settings 1</a>
															<a class="dropdown-item" href="#">Settings 2</a>
														</div>
													</li>
													<li><a class="close-link"><i class="fa fa-close"></i></a>
													</li>
												</ul>
												<div class="clearfix"></div>
											</div>
											<div class="x_content">
												<div class="chart-container">
        											<canvas id="bar-chart1"></canvas>
    											</div> 
											</div>
										</div>
									</div>

									<!--다섯번째칸-->
									<div class="col-md-4 col-sm-4 ">
										<div class="x_panel tile fixed_height_287 overflow_hidden topcard">
											<div class="x_title">
												<h2>칼로리 소모량</h2>
												<ul class="nav navbar-right panel_toolbox">
													<li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
													</li>
													<li class="dropdown">
														<a href="#" class="dropdown-toggle" data-toggle="dropdown"
															role="button" aria-expanded="false"><i
																class="fa fa-wrench"></i></a>
														<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
															<a class="dropdown-item" href="#">Settings 1</a>
															<a class="dropdown-item" href="#">Settings 2</a>
														</div>
													</li>
													<li><a class="close-link"><i class="fa fa-close"></i></a>
													</li>
												</ul>
												<div class="clearfix"></div>
											</div>
											<div class="x_content">
									
												<div class="chart-container">
        											<canvas id="bar-chart2"></canvas>
    											</div> 

											</div>
										</div>
									</div>



								</div>

								<!--우측-->
								<div class="col-md-3">

									<div class="col-md-12 col-sm-12">
										<div class="x_panel tile fixed_height_750 overflow_hidden topcard">
											<div class="x_title">
												<h2>캘린더</h2>
												<ul class="nav navbar-right panel_toolbox">
													<li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
													</li>
													<li class="dropdown">
														<a href="#" class="dropdown-toggle" data-toggle="dropdown"
															role="button" aria-expanded="false"><i
 																class="fa fa-wrench"></i></a>
														<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
															<a class="dropdown-item" href="#">Settings 1</a>
															<a class="dropdown-item" href="#">Settings 2</a>
														</div>
													</li>
													<li><a class="close-link"><i class="fa fa-close"></i></a>
													</li>
												</ul>
												<div class="clearfix"></div>
											</div>
											<div class="x_content">
												<div class="container">
													<!-- full calendar js -->
													<div id='calendar'></div>
													<!-- /full calendar js-->
												</div> <!-- end calendar-container -->

												<table class="" style="width:100%">
													<tr>
									  
													  <th>
														<div class="col-lg-7 col-md-7 col-sm-7 ">
														  <p class="">Device</p>
														</div>
														<div class="col-lg-5 col-md-5 col-sm-5 ">
														  <p class="">Progress</p>
														</div>
													  </th>
													</tr>
													<tr>
													  <td>
														<table class="tile_info">
														  <tr>
															<td>
															  <p><i class="fa fa-square blue"></i>스쿼트 </p>
															</td>
															<td>80kcal</td>
														  </tr>
														  <tr>
															<td>
															  <p><i class="fa fa-square green"></i>팔굽혀펴기
															  </p>
															</td>
															<td>270kcal</td>
														  </tr>
														  <tr>
															<td>
															  <p><i class="fa fa-square purple"></i>줌바댄스
															  </p>
															</td>
															<td>200kcal</td>
														  </tr>
														  <tr>
															<td>
															  <p><i class="fa fa-square aero"></i>라인댄스 </p>
															</td>
															<td>100kcal</td>
														  </tr>
														  <tr>
															<td>
															  <p><i class="fa fa-square red"></i>Others </p>
															</td>
															<td>300kcal</td>
														  </tr>
														</table>
													  </td>
													</tr>
												  </table>


											</div> <!-- end container -->
										</div>
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

</script>
<script src="assets/build/js/custom.js"></script>
<script	src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
<!-- 바 js-->
<script src="assets\Exercise\js\yong.js\bar.js"></script>
<!-- 라인 js-->
<script src="assets/build/js/line.js"></script>
<!-- 도넛 js-->
<script src="assets/build/js/doughtnut.js"></script>
<!-- 가로 바 js-->
<script src="assets/build/js/widthBar.js"></script>
                
                
                
                
<!--full calendar js -->
<script src="index.global.min.js"></script>
<script>

    document.addEventListener('DOMContentLoaded', function () {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth'
        });
        calendar.render();
    });

</script>
<!-- end full calendar js-->


</body>
</html>
