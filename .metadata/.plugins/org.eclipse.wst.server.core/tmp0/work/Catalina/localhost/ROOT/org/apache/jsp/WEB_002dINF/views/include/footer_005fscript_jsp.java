/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/9.0.78
 * Generated at: 2023-09-13 07:44:36 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.views.include;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class footer_005fscript_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent,
                 org.apache.jasper.runtime.JspSourceImports {

  private static final javax.servlet.jsp.JspFactory _jspxFactory =
          javax.servlet.jsp.JspFactory.getDefaultFactory();

  private static java.util.Map<java.lang.String,java.lang.Long> _jspx_dependants;

  private static final java.util.Set<java.lang.String> _jspx_imports_packages;

  private static final java.util.Set<java.lang.String> _jspx_imports_classes;

  static {
    _jspx_imports_packages = new java.util.HashSet<>();
    _jspx_imports_packages.add("javax.servlet");
    _jspx_imports_packages.add("javax.servlet.http");
    _jspx_imports_packages.add("javax.servlet.jsp");
    _jspx_imports_classes = null;
  }

  private volatile javax.el.ExpressionFactory _el_expressionfactory;
  private volatile org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public java.util.Map<java.lang.String,java.lang.Long> getDependants() {
    return _jspx_dependants;
  }

  public java.util.Set<java.lang.String> getPackageImports() {
    return _jspx_imports_packages;
  }

  public java.util.Set<java.lang.String> getClassImports() {
    return _jspx_imports_classes;
  }

  public javax.el.ExpressionFactory _jsp_getExpressionFactory() {
    if (_el_expressionfactory == null) {
      synchronized (this) {
        if (_el_expressionfactory == null) {
          _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
        }
      }
    }
    return _el_expressionfactory;
  }

  public org.apache.tomcat.InstanceManager _jsp_getInstanceManager() {
    if (_jsp_instancemanager == null) {
      synchronized (this) {
        if (_jsp_instancemanager == null) {
          _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
        }
      }
    }
    return _jsp_instancemanager;
  }

  public void _jspInit() {
  }

  public void _jspDestroy() {
  }

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
      throws java.io.IOException, javax.servlet.ServletException {

    if (!javax.servlet.DispatcherType.ERROR.equals(request.getDispatcherType())) {
      final java.lang.String _jspx_method = request.getMethod();
      if ("OPTIONS".equals(_jspx_method)) {
        response.setHeader("Allow","GET, HEAD, POST, OPTIONS");
        return;
      }
      if (!"GET".equals(_jspx_method) && !"POST".equals(_jspx_method) && !"HEAD".equals(_jspx_method)) {
        response.setHeader("Allow","GET, HEAD, POST, OPTIONS");
        response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "JSP들은 오직 GET, POST 또는 HEAD 메소드만을 허용합니다. Jasper는 OPTIONS 메소드 또한 허용합니다.");
        return;
      }
    }

    final javax.servlet.jsp.PageContext pageContext;
    javax.servlet.http.HttpSession session = null;
    final javax.servlet.ServletContext application;
    final javax.servlet.ServletConfig config;
    javax.servlet.jsp.JspWriter out = null;
    final java.lang.Object page = this;
    javax.servlet.jsp.JspWriter _jspx_out = null;
    javax.servlet.jsp.PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
      out.write("<!-- FOOT SCRIPT -->\r\n");
      out.write("<!-- jQuery -->\r\n");
      out.write("<script src=\"assets/js/jQuery-3.7.1/jquery-3.7.1.js\"></script>\r\n");
      out.write("<script src=\"assets\\vendors\\jquery-ui-1.13.2.custom\\jquery-ui.min.js\"></script>\r\n");
      out.write("<!-- Bootstrap -->\r\n");
      out.write("<script src=\"assets\\js\\bootstarp-4.6.2\\bootstrap.bundle.js\"></script>\r\n");
      out.write("<!-- FastClick -->\r\n");
      out.write("<script src=\"assets/vendors/fastclick/lib/fastclick.js\"></script>\r\n");
      out.write("<!-- NProgress -->\r\n");
      out.write("<script src=\"assets/vendors/nprogress/nprogress.js\"></script>\r\n");
      out.write("<!-- iCheck -->\r\n");
      out.write("<script src=\"assets/vendors/iCheck/icheck.min.js\"></script>\r\n");
      out.write("<!-- Datatables -->\r\n");
      out.write("<script src=\"assets/js/datatables/jquery.dataTables.js\"></script>\r\n");
      out.write("<!-- bootstrap-progressbar -->\r\n");
      out.write("<script\r\n");
      out.write("	src=\"assets/vendors/bootstrap-progressbar/bootstrap-progressbar.min.js\"></script>\r\n");
      out.write("<!-- bootstrap-daterangepicker -->\r\n");
      out.write("<script src=\"assets/vendors/moment/min/moment.min.js\"></script>\r\n");
      out.write("<script\r\n");
      out.write("	src=\"assets/vendors/bootstrap-daterangepicker/daterangepicker.js\"></script>\r\n");
      out.write("<!-- bootstrap-wysiwyg -->\r\n");
      out.write("<script\r\n");
      out.write("	src=\"assets/vendors/bootstrap-wysiwyg/js/bootstrap-wysiwyg.min.js\"></script>\r\n");
      out.write("<script src=\"assets/vendors/jquery.hotkeys/jquery.hotkeys.js\"></script>\r\n");
      out.write("\r\n");
      out.write("<script src=\"assets/vendors/google-code-prettify/src/prettify.js\"></script>\r\n");
      out.write("<!-- jQuery Sparklines -->\r\n");
      out.write("<script src=\"assets/vendors/jquery-sparkline/dist/jquery.sparkline.min.js\"></script>\r\n");
      out.write("<!-- Flot -->\r\n");
      out.write("<script src=\"assets/vendors/Flot/jquery.flot.js\"></script>\r\n");
      out.write("<script src=\"assets/vendors/Flot/jquery.flot.pie.js\"></script>\r\n");
      out.write("<script src=\"assets/vendors/Flot/jquery.flot.time.js\"></script>\r\n");
      out.write("<script src=\"assets/vendors/Flot/jquery.flot.stack.js\"></script>\r\n");
      out.write("<script src=\"assets/vendors/Flot/jquery.flot.resize.js\"></script>\r\n");
      out.write("<!-- Flot plugins -->\r\n");
      out.write("<script src=\"assets/vendors/flot.orderbars/js/jquery.flot.orderBars.js\"></script>\r\n");
      out.write("<script src=\"assets/vendors/flot-spline/js/jquery.flot.spline.min.js\"></script>\r\n");
      out.write("<script src=\"assets/vendors/flot.curvedlines/curvedLines.js\"></script>\r\n");
      out.write("<!-- DateJS -->\r\n");
      out.write("<script src=\"assets/vendors/DateJS/build/date.js\"></script>\r\n");
      out.write("<!-- jQuery Tags Input -->\r\n");
      out.write("<script src=\"assets/vendors/jquery.tagsinput/src/jquery.tagsinput.js\"></script>\r\n");
      out.write("<!-- Switchery -->\r\n");
      out.write("<script src=\"assets/vendors/switchery/dist/switchery.min.js\"></script>\r\n");
      out.write("<!-- Select2 -->\r\n");
      out.write("<script src=\"assets/vendors/select2/dist/js/select2.full.min.js\"></script>\r\n");
      out.write("<!-- Parsley -->\r\n");
      out.write("<script src=\"assets\\vendors\\Parsley.js-2.9.2\\dist\\parsley.min.js\"></script>\r\n");
      out.write("<!-- Autosize -->\r\n");
      out.write("<script src=\"assets/vendors/autosize/dist/autosize.min.js\"></script>\r\n");
      out.write("<!-- jQuery autocomplete -->\r\n");
      out.write("<script\r\n");
      out.write("	src=\"assets/vendors/devbridge-autocomplete/dist/jquery.autocomplete.min.js\"></script>\r\n");
      out.write("<!-- starrr -->\r\n");
      out.write("<script src=\"assets/vendors/starrr/dist/starrr.js\"></script>\r\n");
      out.write("<!-- Custom Theme Scripts -->\r\n");
      out.write("<script src=\"assets/build/js/custom.min.js\"></script>\r\n");
      out.write("<!-- Kakao Login SDK -->\r\n");
      out.write("<script src=\"https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js\"\r\n");
      out.write("	integrity=\"sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/iyNmWMBhcItAjH\"\r\n");
      out.write("	crossorigin=\"anonymous\"></script>\r\n");
      out.write("<script>\r\n");
      out.write("	Kakao.init('14274277b7b930e3289085afa313c81c') // 사용하려는 앱의 JavaScript 키 입력\r\n");
      out.write("</script>");
    } catch (java.lang.Throwable t) {
      if (!(t instanceof javax.servlet.jsp.SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try {
            if (response.isCommitted()) {
              out.flush();
            } else {
              out.clearBuffer();
            }
          } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
