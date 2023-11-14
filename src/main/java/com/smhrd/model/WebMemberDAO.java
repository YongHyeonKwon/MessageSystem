package com.smhrd.model;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.smhrd.db.SqlSessionManager;

public class WebMemberDAO {

	SqlSessionFactory sqlSessionFactory 
	= SqlSessionManager.getsqlSession();
	

public int join (WebMember member) {
	
	SqlSession sqlSession = sqlSessionFactory.openSession(true);
	
	int cnt = sqlSession.insert("join", member);
	
	sqlSession.close();
	
	return cnt;
}
	
public WebMember login(WebMember member) {
	
	SqlSession sqlSession = sqlSessionFactory.openSession(true);
	
	WebMember info = sqlSession.selectOne("login", member);
	
	sqlSession.close();
	
	
	return info;
}
	
}
