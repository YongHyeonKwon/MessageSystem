<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
										<div class="form-group row">
											<label class="control-label col-md-3 col-sm-3 ">회원
												EMAIL</label>
											<div class="col-md-9 col-sm-9 ">
												<c:choose>
													<c:when test="${email != null}">
														<input type="text" class="form-control"
															readonly="readonly" placeholder="Read-Only Input"
															name="id" value=${email}>
													</c:when>
													<c:otherwise>
														<input type="text" class="form-control"
															readonly="readonly" placeholder="Read-Only Input"
															name="id" value="defaultEmail">
													</c:otherwise>
												</c:choose>

											</div>
										</div>
										<div class="form-group row">
											<label class="control-label col-md-3 col-sm-3 ">회원 이름</label>
											<div class="col-md-9 col-sm-9 ">
												<c:choose>
													<c:when test="${name != null}">
														<input type="text" class="form-control"
															readonly="readonly" placeholder="Read-Only Input"
															name="name" value=${name}>
													</c:when>
													<c:otherwise>
														<input type="text" class="form-control"
															readonly="readonly" placeholder="Read-Only Input"
															name="name" value="DefaultName">
													</c:otherwise>
												</c:choose>
											</div>
										</div>
										<div class="form-group row">
											<label class="control-label col-md-3 col-sm-3 ">담당
												트레이너</label>
											<div class="col-md-9 col-sm-9 ">
												<c:choose>
													<c:when test="${trainer}">
														<input type="text" class="form-control"
															readonly="readonly" placeholder="Read-Only Input"
															name="trainer" value=${trainer}>
													</c:when>
													<c:otherwise>
														<input type="text" class="form-control"
															readonly="readonly" placeholder="Read-Only Input"
															name="trainer" value="DefaultTrainer">
													</c:otherwise>
												</c:choose>
											</div>
										</div>
										<div class="form-group row ">
											<label class="control-label col-md-3 col-sm-3 ">몸무게</label>
											<div class="col-md-9 col-sm-9 ">
												<c:choose>
													<c:when test="${weight != null}">
														<input type="text" class="form-control"
															placeholder="몸무게를 입력해주세요. 숫자만 입력 가능 : kg" name="weight"
															value=${weight}>
													</c:when>
													<c:otherwise>
														<input type="text" class="form-control"
															placeholder="몸무게를 입력해주세요. 숫자만 입력 가능 : kg" name="weight"
															value="0">
													</c:otherwise>
												</c:choose>

											</div>
										</div>
										<div class="form-group row ">
											<label class="control-label col-md-3 col-sm-3 ">키</label>
											<div class="col-md-9 col-sm-9 ">
												<c:choose>
													<c:when test="${height != null}">
														<input type="text" class="form-control"
															placeholder="몸무게를 입력해주세요. 숫자만 입력 가능 : kg" name="height"
															value=${height}>
													</c:when>
													<c:otherwise>
														<input type="text" class="form-control"
															placeholder="몸무게를 입력해주세요. 숫자만 입력 가능 : kg" name="height"
															value="0">
													</c:otherwise>
												</c:choose>
											</div>
										</div>