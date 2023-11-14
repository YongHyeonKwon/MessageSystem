package com.smhrd.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.smhrd.model.Board;
import com.smhrd.model.BoardDAO;



@WebServlet("/DetailService")
public class DetailService extends HttpServlet {
	private static final long serialVersionUID = 1L;


	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// 사용자가 몇 번째 게시글을 선택했는지 
		// 해당 값을 가져와 Detail.jsp에 띄워주기!
		
		String num = request.getParameter("num");
		
		BoardDAO dao = new BoardDAO() ;
		
		Board board = dao.detail(num);
		
		request.setAttribute("board", board);
		
		String url = "WEB-INF/BoardDetail.jsp";
		RequestDispatcher rd = request.getRequestDispatcher(url);
		rd.forward(request, response);
		
		
	}

}
