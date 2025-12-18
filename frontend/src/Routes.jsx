import React from "react";
import { Routes, Route } from "react-router-dom";
import RouteGuard from "./components/RouteGuard";

// Public Components
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Sidebar from "./components/pages/category";
import Products from "./components/pages/BookList";
import ExamProducts from "./components/pages/ExamProducts";
import QuizApp from "./components/pages/question";
import ExamList from "./components/pages/examdetail";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import SignLanguageVocabulary from "./components/pages/Siglunguage/SignLanguage";
import Dictionary from "./components/Dictionary/Dictionary";
import ReadPage from "./components/pages/BookRead";
import BookCatViews from "./components/pages/bookCatViews";
import Market from "./components/pages/Market";
import BookSell from "./components/pages/BookSell";
import BookRent from "./components/pages/BookRent";
import MarketCartSimple from "./components/pages/MarketCartSimple";
import MarketCart from "./components/pages/MarketCart";
import ShoppingCart from "./components/pages/ShoppingCart";
import MyRentals from "./components/pages/MyRentals";
import UserDashboard from "./components/pages/UserDashboard";
import MarketAdmin from "./components/pages/MarketAdmin";
import SellerDashboard from "./components/pages/SellerDashboard";
import ResearchProjectsList from "./components/pages/project/ResearchProjectsList";
import ProjectDetailSinglePage from "./components/pages/project/ResearchProjectsdetail";
import DApp from "./dictionary/DApp"
import PDFAnalyzer from "./components/pages/PDFAnalyzer"
import PaymentConfirmation from "./components/pages/PaymentConfirmation"
import AIHelpCenter from "./components/AIAssistant/AIHelpCenter"
import AIDemo from "./components/pages/AIDemo"
import AudioBookPlayerEnhanced from "./components/pages/AudioBookPlayerEnhanced"
import AudioBookLibrary from "./components/pages/AudioBookLibrary"
import AudioBookDetail from "./components/pages/AudioBookDetail"
import PDFReaderWithAudio from "./components/pages/PDFReaderWithAudio"
import EnhancedPDFReader from "./components/pages/EnhancedPDFReader"

// Seller Components
import SellerDashboardNew from "./components/seller/SellerDashboard";
import SellerAdminDashboard from "./components/seller/SellerAdminDashboard";
import OrderTracking from "./components/seller/OrderTracking";
import SellerUpgrade from "./components/seller/SellerUpgrade";
import SimpleSellerDashboard from "./components/SimpleSellerDashboard";
import SellerAuthWrapper from "./components/seller/SellerAuthWrapper";

// Admin Components
import AdminDashboardLayout from "./components/admin/AdminDashboardLayout";
import Login from "./components/admin/Login";
import Dashboard from "./components/admin/Dashboard";
import AdminBooks from "./components/admin/AdminBooks";
import AdminBookUpload from "./components/admin/AdminBookUpload";
import AdminExam from "./components/admin/AdminExams";
import UploadExam from "./components/admin/UploadExam";
import UploadQuiz from "./components/admin/uploadquzi";
import AdminUsers from "./components/admin/AdminUsers";
import CreateAccount from "./components/admin/CreateAccount";
import AdminProjects from "./components/admin/AdminProjects";
import UploadProject from "./components/admin/UploadProject";
import AdminSignWords from "./components/admin/AdminSignWords";
import StudentIdCard from "./components/admin/StudentIdCard";
import AdminPanel from "./components/admin/aboutAsAdminPanel ";

import Unauthorized from "./components/pages/Unauthorized"; // You need this page
import AdminAuthWrapper from "./components/admin/AdminAuthWrapper";
import NotFound from "./components/pages/NotFound"; // Optional for 404

// Dummy fallback component
const DummyPage = ({ title }) => <div className="p-6">{title} Page</div>;

const AppRoutes = () => (
  <Routes>
    {/* ✅ Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/products" element={<Products />} />
    <Route path="/exam" element={<ExamProducts />} />
    <Route path="/subscribe" element={<Subscribe />} />
    <Route path="/exam/question/:subjectId" element={<QuizApp />} />
    <Route path="/exam/:categoryId" element={<ExamList />} />
    <Route path="/exam/list/exam/question/:id" element={<QuizApp />} />
    <Route path="/category" element={<Sidebar />} />
    <Route path="/testimonials" element={<Testimonials />} />
    <Route path="/signlanguage" element={<SignLanguageVocabulary />} />
    <Route path="/dictionary" element={<DApp />} />
    <Route path="/book/read/:id" element={<ReadPage />} />
    <Route path="/category/:categoryName" element={<BookCatViews />} />
    <Route path="/project/reaserch" element={<ResearchProjectsList />} />
    <Route path="/project/research/:id" element={<ProjectDetailSinglePage />} />
    <Route path="/subcategory/:subcategoryName" element={<BookCatViews />} />
    <Route path="/pdf" element={<PDFAnalyzer />} />
    <Route path="/help" element={<AIHelpCenter />} />
    <Route path="/ai" element={<AIDemo />} />
    <Route path="/ai-assistant" element={<AIDemo />} />
    <Route path="/audiobook/:id" element={<AudioBookPlayerEnhanced />} />
    <Route path="/audiobooks" element={<AudioBookPlayerEnhanced />} />
    <Route path="/audiobook-library" element={<AudioBookLibrary />} />
    <Route path="/audiobook-detail/:id" element={<AudioBookDetail />} />
    <Route path="/pdf-reader/:id" element={<PDFReaderWithAudio />} />
    <Route path="/enhanced-reader/:id" element={<EnhancedPDFReader />} />

    {/* Market Routes */}
    <Route path="/market" element={<Market />} />
    <Route path="/market/cart" element={<MarketCart />} />
    <Route path="/market/book/:id/sell" element={<BookSell />} />
    <Route path="/market/book/:id/rent" element={<BookRent />} />
    <Route path="/cart" element={<ShoppingCart />} />
    <Route path="/rentals" element={<MyRentals />} />
    <Route path="/dashboard" element={<UserDashboard />} />
    <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
    <Route path="/payment-success" element={<PaymentConfirmation />} />
    <Route path="/payment-failure" element={<PaymentConfirmation />} />
    <Route path="/admin/market" element={<MarketAdmin />} />
    <Route path="/seller/dashboard" element={
      <RouteGuard requiredRole="seller">
        <SellerDashboardNew />
      </RouteGuard>
    } />
    <Route path="/seller/simple" element={
      <RouteGuard requiredRole="seller">
        <SimpleSellerDashboard />
      </RouteGuard>
    } />
    <Route path="/seller/admin" element={
      <SellerAuthWrapper>
        <SellerAdminDashboard />
      </SellerAuthWrapper>
    } />
    <Route path="/seller/tracking" element={
      <RouteGuard requiredRole="seller">
        <OrderTracking />
      </RouteGuard>
    } />
    <Route path="/seller/upgrade" element={<SellerUpgrade />} />

    
    {/* Login & Auth Fail Pages */}
    <Route path="/login" element={<Login />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* ✅ Protected Admin Routes */}
    <Route
      path="/admin/*"
      element={
        <AdminAuthWrapper>
          <AdminDashboardLayout />
        </AdminAuthWrapper>
      }
    >
      <Route path="" element={<Dashboard />} />
      <Route path="books" element={<AdminBooks />} />
      <Route path="books/upload" element={<AdminBookUpload />} />
      <Route path="exams" element={<AdminExam />} />
      <Route path="exams/upload" element={<UploadExam />} />
      <Route path="exams/quzi/upload" element={<UploadQuiz />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="users/create-account" element={<CreateAccount />} />
      <Route path="projects" element={<AdminProjects />} />
      <Route path="projects/upload" element={<UploadProject />} />
      <Route path="subjects" element={<StudentIdCard/>} />
      <Route path="AdminSignWords" element={<AdminSignWords />} />
      <Route path="reports" element={<AdminPanel/>} />
      <Route path="feedback" element={<DummyPage title="Feedback" />} />
      <Route path="settings" element={<DummyPage title="Settings" />} />
      <Route path="profile" element={<DummyPage title="Profile" />} />
      <Route path="notifications" element={<DummyPage title="Notifications" />} />
      <Route path="messages" element={<DummyPage title="Messages" />} />
      <Route path="activity" element={<DummyPage title="Activity Log" />} />
      <Route path="help" element={<DummyPage title="Help" />} />
      <Route path="logout" element={<DummyPage title="Logout" />} />
    </Route>

    {/* Optional: Catch-all 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
