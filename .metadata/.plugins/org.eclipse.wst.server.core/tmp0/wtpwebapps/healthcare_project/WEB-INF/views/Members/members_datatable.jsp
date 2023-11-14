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
					<div class="row">
						<div class="col-md-8 col-sm-12">
							<!-- main content -->
							<%
							/* 기본적으로 메인 컨텐츠는 이 곳에 입력합니다. */
							%>
							<div class="x_panel">
								<div class="card-group">
									<div class="card border-dark mb-3" style="max-width: 18rem;">
										<div class="card-header">Doughnut Chart</div>
										<div class="card-body text-danger">
											<canvas id="doughnutChart"></canvas>
										</div>
									</div>
									<div class="card border-dark mb-3" style="max-width: 18rem;">
										<div class="card-header">PolarAreaChart</div>
										<div class="card-body text-danger">
											<canvas id="polarAreaChart"></canvas>
										</div>
									</div>
									<div class="card border-dark mb-3" style="max-width: 18rem;">
										<div class="card-header">Header</div>
										<div class="card-body text-danger">
											<canvas id="barChart" height="300px"></canvas>
										</div>
									</div>
									<div class="card border-dark mb-3" style="max-width: 18rem;">
										<div class="card-header">Header</div>
										<div class="card-body text-danger">
											<canvas id="pieChart"></canvas>
										</div>
									</div>
								</div>
							</div>
							<div class="x_panel">
								<table id="dataTable" class="display dataTable">
									<thead>
										<tr>
											<th>사진</th>
											<th>번호</th>
											<th>이름</th>
											<th>나이</th>
											<th>성별</th>
											<th>몸무게</th>
											<th>키</th>
											<th>직업</th>
											<th>연락처</th>
											<th>트레이너</th>
											<th>등록일</th>
										</tr>
									</thead>
									<!-- table ajax return data-->
								</table>
							</div>
							<!-- /main content -->
						</div>
						<div class="col-md-4 col-sm-12">
							<div class="x_panel">
								<div id='fullCalendar'></div>
								<br>
								<div id='calendar'></div>
							</div>
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
	<!-- Members Custom Scripts -->
	<script src="assets/Members/js/custom.js"></script>

	<!-- chart.js -->
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script>
		<!-- doughnut chart -->
		const doughnut = document.getElementById('doughnutChart');

		new Chart(doughnut,
				{
					type : 'doughnut',
					data : {
						labels : [ 'Red', 'Blue', 'Yellow', 'Green', 'Purple',
								'Orange' ],
						datasets : [ {
							label : '# of Votes',
							data : [ 12, 19, 3, 5, 2, 3 ],
							borderWidth : 1
						} ]
					},
					options : {
						scales : {
							y : {
								beginAtZero : true
							}
						}
					}
				});
		<!-- polarArea chart-->
		const polarArea = document.getElementById('polarAreaChart');

		new Chart(polarArea,
				{
					type : 'polarArea',
					data : {
						labels : [ 'Red', 'Blue', 'Yellow', 'Green', 'Purple',
								'Orange' ],
						datasets : [ {
							label : '# of Votes',
							data : [ 12, 19, 3, 5, 2, 3 ],
							borderWidth : 1
						} ]
					},
					options : {
						scales : {
							y : {
								beginAtZero : true
							}
						}
					}
				});
		<!-- bar Chart-->
		const bardata = {
				  labels: ['1', '2','3','4','5','6','7'],
				  datasets: [{
				    label: 'My First Dataset',
				    data: [65, 59, 80, 81, 56, 55, 40],
				    backgroundColor: [
				      'rgba(255, 99, 132, 0.2)',
				      'rgba(255, 159, 64, 0.2)',
				      'rgba(255, 205, 86, 0.2)',
				      'rgba(75, 192, 192, 0.2)',
				      'rgba(54, 162, 235, 0.2)',
				      'rgba(153, 102, 255, 0.2)',
				      'rgba(201, 203, 207, 0.2)'
				    ],
				    borderColor: [
				      'rgb(255, 99, 132)',
				      'rgb(255, 159, 64)',
				      'rgb(255, 205, 86)',
				      'rgb(75, 192, 192)',
				      'rgb(54, 162, 235)',
				      'rgb(153, 102, 255)',
				      'rgb(201, 203, 207)'
				    ],
				    borderWidth: 1
				  }]
				};
		const barconfig = {
				  type: 'bar',
				  data: bardata,
				  options: {
				    scales: {
				      y: {
				        beginAtZero: true
				      }
				    }
				  },
				};

		
		const bar = document.getElementById('barChart');
		new Chart(bar, barconfig);
		<!-- pie chart -->
		const piedata = {
				  labels: [
				    'Red',
				    'Blue',
				    'Yellow'
				  ],
				  datasets: [{
				    label: 'My First Dataset',
				    data: [300, 50, 100],
				    backgroundColor: [
				      'rgb(255, 99, 132)',
				      'rgb(54, 162, 235)',
				      'rgb(255, 205, 86)'
				    ],
				    hoverOffset: 4
				  }]
				};
		const pieconfig = {
				  type: 'pie',
				  data: piedata,
				};
		const pie = document.getElementById('pieChart');
		new Chart(pie, pieconfig);
	</script>

	<!-- calendar.js : https://github.com/williamtroup/Calendar.js -->
	<script src="assets/js/Calendar/calendar.js"></script>
	<script>
		var calendarInstance = new calendarJs("calendar", {
			exportEventsEnabled : true,
		});

		document.title += " v" + calendarInstance.getVersion();

		var event = {
			from : new Date(),
			to : new Date(),
			title : "New Event",
			description : "A description of the new event"
		};

		calendarInstance.addEvent(event);
	</script>

	<!-- full canlendar -->
	<script
		src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
	<script>
		document.addEventListener('DOMContentLoaded', function() {
			var calendarEl = document.getElementById('fullCalendar');
			var calendar = new FullCalendar.Calendar(calendarEl, {
				initialView : 'dayGridMonth'
			});
			calendar.render();
		});
	</script>
</body>
</html>