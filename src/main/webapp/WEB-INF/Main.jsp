<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import = "com.smhrd.model.*" %>
<%@ page import = "java.util.ArrayList" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<title>Forty by HTML5 UP</title>
		<meta charset="utf-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" href="assets/css/main.css" />
	</head>
	<body>
		<!-- Wrapper -->
			<div id="wrapper">

				<!-- Header -->
					<header id="header" class="alt">
						<a href="goMain.do" class="logo"><strong>Forty</strong> <span>by HTML5 UP</span></a>
						<nav>
							<!-- Q6. 로그인을 한 상태에서는 로그인탭 대신 로그아웃탭과 개인정보수정탭을 출력 -->
								<c:if test="${! empty info}">
								<a href="LogoutService.do">로그아웃</a>
								<a href="UpdateMember.jsp.do">개인정보수정탭</a>
								</c:if>
								<c:if test="${empty info}">
								<a href="#menu">로그인</a>
								</c:if>
						</nav>
					</header>

				<!-- Menu -->
					<nav id="menu">	
						<ul class="links">
						<!-- Q3. 로그인 기능 만들기 -->
							<li><h5>로그인</h5></li>
								<form action = "LoginService.do" method = "post">
									<li><input type="text" name = "email" placeholder="Email을 입력하세요"></li>
									<li><input type="password" name = "pw" placeholder="PW를 입력하세요"></li>
									<li><input type="submit" value="LogIn" class="button fit"></li>
								</form>
						</ul>
						<ul class="actions vertical">
						<!-- Q1. 회원가입 기능 만들기 -->
							<li><h5>회원가입</h5></li>
								<form action = "JoinService.do" method = "post">
									<li><input type="text" name = "email" placeholder="Email을 입력하세요"></li>
									<li><input type="password" name = "pw" placeholder="PW를 입력하세요"></li>
									<li><input type="text" name = "tel" placeholder="전화번호를 입력하세요"></li>
									<li><input type="text" name = "address" placeholder="집주소를 입력하세요"></li>
									<li><input type="submit" name = "JoinUs" value="JoinUs" class="button fit"></li>
								</form>
						</ul>
					</nav>			
				<!-- Banner -->
					<section id="banner" class="major">
						<div class="inner">
							<header class="major">
							<!-- Q4. 로그인 후 로그인한 사용자의 아이디로 바꾸기 -->
							<!-- ex) 00님 환영합니다.  -->
								<c:if test="${!empty info}"> <!-- empty -> 값이 없다라는게 아니라면~ -->
									<h1>${info.email}님 환영합니다.</h1>
								</c:if>
								<c:if test="${empty info}"> <!-- empty -> 값이 없다면~ -->
									<h1>로그인 한 세션아이디를 출력해주세요</h1>								
								</c:if>
					
							</header>
							<div class="content">
								<p>게시판을 이용해보세요 ^^<br></p>
								<ul class="actions">
									<li><a href="goBoard.do" class="button next scrolly">게시판 바로가기</a></li>
								</ul>
							</div>
						</div>
					</section>

				<!-- Main -->
					<div id="main">

						<!-- One -->
							<section id="one" class="tiles">
								<article>
									<span class="image">
										<img src="images/pic01.jpg" alt="" />
									</span>
									<header class="major">
										<h3><a href="#" class="link">HTML</a></h3>
										<p>홈페이지를 만드는 기초 언어</p>
									</header>
								</article>
								<article>
									<span class="image">
										<img src="images/pic02.jpg" alt="" />
									</span>
									<header class="major">
										<h3><a href="#" class="link">CSS</a></h3>
										<p>HTML을 디자인해주는 언어</p>
									</header>
								</article>
								<article>
									<span class="image">
										<img src="images/pic03.jpg" alt="" />
									</span>
									<header class="major">
										<h3><a href="#" class="link">Servlet/JSP</a></h3>
										<p>Java를 기본으로 한 웹 프로그래밍 언어/스크립트 언어</p>
									</header>
								</article>
								<article>
									<span class="image">
										<img src="images/pic04.jpg" alt="" />
									</span>
									<header class="major">
										<h3><a href="#" class="link">JavaScript</a></h3>
										<p>HTML에 기본적인 로직을 정의할 수 있는 언어</p>
									</header>
								</article>
								<article>
									<span class="image">
										<img src="images/pic05.jpg" alt="" />
									</span>
									<header class="major">
										<h3><a href="#" class="link">MVC</a></h3>
										<p>웹 프로젝트 중 가장 많이 사용하는 디자인패턴</p>
									</header>
								</article>
								<article>
									<span class="image">
										<img src="images/pic06.jpg" alt="" />
									</span>
									<header class="major">
										<h3><a href="#" class="link">Web Project</a></h3>
										<p>여러분의 최종프로젝트에 웹 기술을 활용하세요!</p>
									</header>
								</article>
							</section>
							
					<!-- Two -->
							<section id="two">
								<div class="inner">
									<header class="major">
										<c:if test="${!empty info }">
											<h2>${info.email}님에게 온 메세지 확인하기</h2>
										</c:if>
										<c:if test="${empty info }">
										<h2>나에게 온 메세지 확인하기</h2>
										</c:if>
									
									</header>
									<p></p>
									<ul class="actions">
										<!-- Q12. 로그인 이메일 출력! -->
										<!-- ex) 00님에게 온 메시지  -->
										
										<!-- Q14. 메시지 전체 삭제 기능 -->								
										<li><a href="#" class="button next scrolly">전체삭제하기</a></li>
									</ul>
									<!-- Q13. table형태로 나한테 온 메시지만 가져와서 보여주기 -->
									<!--  로그인이 된 회원이라면 곧바로 메세지를 가져올 수 있도록 한다! -->
									<%
										MessageDAO dao = new MessageDAO();
										
										// 로그인 된 회원의 정보를 가져오기 위한 작업! 
										WebMember info = (WebMember) session.getAttribute("info");
										
										// 로그인이 되어있는 상태인지 확인하기
											ArrayList<Message> list = new ArrayList<>();
										
										if(info != null) {
											// 회원에 정보를 토대로 입력된 메세지 내용 가져오기! 
											list = dao.showMessage(info.getEmail());
											session.setAttribute("list", list);
										}
										
										
										
									%>
									<table>
										<tr>
											<td>번호</td>
											<td>보낸사람</td>
											<td>내용</td>
											<td>날짜</td>
											<td>삭제</td>
										</tr>
																				
										<%-- <%for(int i=0; i<list.size(); i++) {
										
										<tr>
											<td><%= list.get(i).getNum()%></td>
											<td><%= list.get(i).getSendName()%></td>
											<td><%= list.get(i).getMessage()%></td>
											<td><%= list.get(i).getM_date()%></td>
										</tr>
										
										
										<%}%> --%>
										
										<c:forEach var="board" items="${list}" varStatus= "status">
											<tr>
												<td>${status.index + 1}</td> <!-- 게시글 번호 -->
												<td>${board.sendName}</td> 
												<td>${board.message}</td> 
												<td>${board.m_date}</td> 
												<td><a href="DeleteOne.do?num=${board.num}">삭제</a></td>
											</tr>
											
										</c:forEach>
										
										
									</table>
									
									
									<!-- Q15. 메시지 개별 삭제 기능 -->
									
								</div>
							</section>

					</div>

				<!-- Contact -->
					<section id="contact">
						<div class="inner">
							<section>
							<!-- Q11. 메시지 보내기 기능 -->
								<form action = "MessageService.do" method="post">
								<div class="field half first">
										<label for="name">Name</label>
										<input type="text" name="sendName" id="name" placeholder="보내는 사람 이름" />
									</div>
									<div class="field half">
										<label for="email">Email</label>
										<input type="text" name="receiveEmail" id="email" placeholder="받는 사람 이메일"/>
									</div>

									<div class="field">
										<label for="message">Message</label>
										<textarea name = "message" id="message" rows="6"></textarea>
									</div>
									<ul class="actions">
										<li><input type="submit" class="special" /></li>
										<li><input type="reset" value="Clear" /></li>
									</ul>
								</form>
							</section>
							
							<section class="split">
								<section>
									<div class="contact-method">
										<span class="icon alt fa-envelope"></span>
										<h3>Email</h3>
										<!-- Q5. 로그인 한 사용자의 이메일을 출력 -->
										<a href="#"></a>
									</div>
								</section>
								<section>
									<div class="contact-method">
										<span class="icon alt fa-phone"></span>
										<h3>Phone</h3>
										<!-- Q5. 로그인 한 사용자의 전화번호를 출력 -->
										<span></span>
									</div>
								</section>
								<section>
									<div class="contact-method">
										<span class="icon alt fa-home"></span>
										<h3>Address</h3>
										<!-- Q5. 로그인 한 사용자의 집주소를 출력 -->
										<span></span>
									</div>
								</section>
							</section>					
						</div>
					</section>

				<!-- Footer -->
					<footer id="footer">
						<div class="inner">
							<ul class="icons">
								<li><a href="#" class="icon alt fa-twitter"><span class="label">Twitter</span></a></li>
								<li><a href="#" class="icon alt fa-facebook"><span class="label">Facebook</span></a></li>
								<li><a href="#" class="icon alt fa-instagram"><span class="label">Instagram</span></a></li>
								<li><a href="#" class="icon alt fa-github"><span class="label">GitHub</span></a></li>
								<li><a href="#" class="icon alt fa-linkedin"><span class="label">LinkedIn</span></a></li>
							</ul>
							<ul class="copyright">
								<li>&copy; Untitled</li><li>Design: <a href="https://html5up.net">HTML5 UP</a></li>
							</ul>
						</div>
					</footer>

			</div>

		<!-- Scripts -->
			<script src="assets/js/jquery.min.js"></script>
			<script src="assets/js/jquery.scrolly.min.js"></script>
			<script src="assets/js/jquery.scrollex.min.js"></script>
			<script src="assets/js/skel.min.js"></script>
			<script src="assets/js/util.js"></script>
			<script src="assets/js/main.js"></script>

	</body>
</html>

