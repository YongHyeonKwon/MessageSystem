<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<div class="left_col scroll-view">
	<div class="navbar nav_title" style="border: 0;">
		<a href="/Main.say?c=main" class="site_title"><i class="fa fa-paw"></i>
			<span>HealthCare!</span></a>
	</div>

	<div class="clearfix"></div>

	<!-- menu profile quick info -->
	<div class="profile clearfix">
		<div class="profile_pic">
			<img src="${profileImageUrl}" alt="..." class="img-circle profile_img">
		</div>
		<div class="profile_info">
			<span>어서오세요,</span>
			<h2>${nickname}님</h2>
		</div>
		<div class="clearfix"></div>
	</div>
	<!-- /menu profile quick info -->

	<br />

	<!-- sidebar menu -->
	<div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
		<div class="menu_section">
			<h3>General</h3>
			<ul class="nav side-menu">
				<li><a><i class="fa fa-home"></i> Home <span
						class="fa fa-chevron-down"></span></a>
					<ul class="nav child_menu">
						<li><a href="/Main.say">Main Sub1</a></li>
						<li><a href="/Main.say?c=list">Main Sub2</a></li>
						<li><a href="/Main.say?c=sub3">Main Sub3</a></li>
					</ul></li>
				<li><a><i class="fa fa-edit"></i> 회원 정보 <span
						class="fa fa-chevron-down"></span></a>
					<ul class="nav child_menu">
						<li><a href="/Members.say">Member Main</a></li>
						<li><a href="/Members.say?c=list">Member list</a></li>
						<li><a href="/Members.say?c=json">Member jsondata</a></li>
						<li><a href="/Members.say?c=input">Member info input</a></li>
					</ul></li>
				<li><a><i class="fa fa-desktop"></i> 영양 정보 <span
						class="fa fa-chevron-down"></span></a>
					<ul class="nav child_menu">
						<li><a href="/Diet.say">Diet Sub1</a></li>
						<li><a href="/Diet.say?c=sub2">Diet Sub2</a></li>
						<li><a href="/Diet.say?c=inputInfo">영양 정보 입력</a></li>
					</ul></li>
				<li><a><i class="fa fa-table"></i> 운동 정보 <span
						class="fa fa-chevron-down"></span></a>
					<ul class="nav child_menu">
						<li><a href="/Exercise.say">Exercise Sub1</a></li>
						<li><a href="/Exercise.say?c=sub2">Exercise Sub2</a></li>
						<li><a href="/Exercise.say?c=inputInfo">운동 정보 입력</a></li>
					</ul></li>
			</ul>
		</div>
	</div>
	<!-- /sidebar menu -->

	<!-- /menu footer buttons -->
	<div class="sidebar-footer hidden-small">
		<a data-toggle="tooltip" data-placement="top" title="Settings"> <span
			class="glyphicon glyphicon-cog" aria-hidden="true"></span>
		</a> <a data-toggle="tooltip" data-placement="top" title="FullScreen">
			<span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
		</a> <a data-toggle="tooltip" data-placement="top" title="Lock"> <span
			class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
		</a> <a data-toggle="tooltip" data-placement="top" title="Logout"
			href="login.html"> <span class="glyphicon glyphicon-off"
			aria-hidden="true"></span>
		</a>
	</div>
	<!-- /menu footer buttons -->
</div>