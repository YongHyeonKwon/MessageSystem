<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
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
<link href="assets/Main/css/custom.css" rel="stylesheet" />
</head>

<body class="nav-md">
	<div class="container body">
		<div class="main_container">
			<!-- page content -->
			<div class="row justify-content-md-center " role="main">
				<!-- content -->
				<div class="col-md-4 col-sm-12">
					<!-- boss login -->
					<div class="x_panel">
						<div class="card">
							<div class="card-body">
								<h5 class="card-title">관리자</h5>
								<!-- boss login form -->
								<form>
									<div class="form-floating mb-3">
										<input type="email" class="form-control" id="floatingInput"
											placeholder="name@example.com"> <label
											for="floatingInput">Email address</label>
									</div>
									<div class="form-floating">
										<input type="password" class="form-control"
											id="floatingPassword" placeholder="Password"> <label
											for="floatingPassword">Password</label>
									</div>
									<a href="#" class="btn btn-primary">관리자 로그인</a>
								</form>
								<!-- /boss login form end -->
							</div>
						</div>
					</div>
					<!-- /boss login end -->
					<!-- trainer login -->
					<div class="x_panel">
						<div class="card">
							<div class="card-body">
								<h5 class="card-title">트레이너</h5>
								<!-- trainer login form -->
								<form>
									<div class="form-floating mb-3">
										<input type="email" class="form-control" id="floatingInput"
											placeholder="name@example.com"> <label
											for="floatingInput">Email address</label>
									</div>
									<div class="form-floating">
										<input type="password" class="form-control"
											id="floatingPassword" placeholder="Password"> <label
											for="floatingPassword">Password</label>
									</div>
									<a href="#" class="btn btn-primary">트레이너 로그인</a>
								</form>
								<!-- /boss login form end -->
							</div>
						</div>
					</div>
					<!-- /trainer login end -->
					<!-- personal member login -->
					<div class="x_panel">
						<div class="card">
							<div class="card-body">
								<h5 class="card-title">일반회원</h5>
								<!-- personal member login form -->
								<form>
									<div class="form-floating mb-3">
										<input type="email" class="form-control" id="floatingInput"
											placeholder="name@example.com"> <label
											for="floatingInput">Email address</label>
									</div>
									<div class="form-floating">
										<input type="password" class="form-control"
											id="floatingPassword" placeholder="Password"> <label
											for="floatingPassword">Password</label>
									</div>
									<a href="#" class="btn btn-primary">일반 회원 로그인</a> <a
										id="kakao-login-btn"
										href="javascript:loginWithKakaoPersonalMember()"> <img
										src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
										width="222" alt="카카오 로그인 버튼" />
									</a>
									<button type="button" class="btn btn-success">
										<a href="/Main.say?c=memberAddInfo&loginType=member"> 회원가입</a>
									</button>
								</form>
								<!-- /personal member login form end -->
							</div>
						</div>
					</div>
					<!-- /personal member login end -->
				</div>
				<!-- /content -->
			</div>
			<!-- /page content -->
		</div>
	</div>

	<jsp:include page="/WEB-INF/views/include/footer_script.jsp" />

	<script>
		function loginWithKakaoPersonalMember() {
			Kakao.Auth.authorize({
				redirectUri : "http://localhost/Main.say?c=kakao",
			});
		}
	</script>

	<!-- Custom Theme Scripts -->
	<script src="assets/Main/js/custom.js"></script>
</body>
</html>
