<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<div class="x_panel">
	<div class="x_content">
		<!-- breakfast -->
		<div class="x_panel">
			<div class="x_content">
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">아침 먹은 것</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="breakfast_foodname">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">아침 먹은 양</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="breakfast_gram">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">아침 먹은 칼로리</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="breakfast_calorie">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">아침 먹은 것</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="breakfast_foodname">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">아침 먹은 양</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="breakfast_gram">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">아침 먹은 칼로리</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="breakfast_calorie">
					</div>
				</div>
			</div>
		</div>
		<!-- /breakfast end -->
		<!--lunch -->
		<div class="x_panel">
			<div class="x_content">
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">점심 먹은 것</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="lunch1_foodname">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">점심 먹은 양</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="lunch1_gram">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">점심 먹은 칼로리</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="lunch1_calorie">
					</div>
				</div>
			</div>
		</div>
		<!-- /lunch end -->
		<!-- dinner -->
		<div class="x_panel">
			<div class="x_content">
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">저녁 먹은 것</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="dinner1_foodname">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">저녁 먹은 양</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="dinner1_graam">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">저녁 먹은 칼로리</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="dinner1_calorie">
					</div>
				</div>
			</div>
		</div>
		<!-- /dinner end -->
		<!-- otherfood -->
		<div class="x_panel">
			<div class="x_content">
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">간식이나 그외 등등
						먹은 것</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="other_foodname">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">간식이나 그외 등등
						먹은 양</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="other_gram">
					</div>
				</div>
				<div class="col-md-4 col-sm-12  form-group">
					<label class="control-label col-md-3 col-sm-3 ">간식이나 그외 등등
						먹은 칼로리</label>
					<div class="col-md-9 col-sm-9 ">
						<input type="text" placeholder=".col-md-3" class="form-control"
							name="other_calorie">
					</div>
				</div>
			</div>
		</div>
		<!-- /otherfood end -->
		<!-- /food end -->

	</div>
</div>