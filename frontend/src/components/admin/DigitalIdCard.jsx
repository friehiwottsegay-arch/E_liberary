import React, { useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import JsBarcode from "jsbarcode";
import { useReactToPrint } from "react-to-print";

const StudentIdCard = () => {
  const printRef = useRef();

  const student = {
    firstName: "Natalie",
    lastName: "Doshier",
    idNumber: "8056732190876",
    phone: "00 000 0000",
    email: "natalie@example.com",
    dob: "01/01/2000",
    expireDate: "31/12/2025",
    joinDate: "05/07/2021",
    issueDate: "06/07/2021",
    department: "Digital Arts & Literature",
    subject: "Manga Studies",
    category: "Japanese Graphic Literature",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    verifyUrl: "https://example.com/verify/STU123456",
    institution: "XYZ University",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Former_University_logo.svg/2560px-Former_University_logo.svg.png",
    address: "123 University Lane, Tech City",
    signature: "/signature-sample.png", // Can be hosted image
  };

  useEffect(() => {
    JsBarcode("#barcode", student.idNumber, {
      format: "CODE128",
      displayValue: true,
      fontSize: 10,
      width: 1.5,
      height: 40,
      margin: 0,
    });
  }, [student.idNumber]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${student.firstName}_${student.lastName}_IDCard`,
  });

  return (
    <div className="font-sans min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Student ID Card</h1>
        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded shadow hover:from-blue-700 hover:to-purple-700"
        >
          Print / Download
        </button>
      </div>

      <div className="flex justify-center">
        <div
          ref={printRef}
          className="flex flex-col md:flex-row gap-6"
          style={{ width: "calc(85.6mm * 2 + 20px)" }}
        >
          {/* FRONT SIDE */}
          <div
            className="relative rounded-lg overflow-hidden border border-gray-300 shadow-lg"
            style={{
              width: "85.6mm",
              height: "53.98mm",
              background: "linear-gradient(to bottom right, #e0f7fa, #fffde7)",
            }}
          >
            <div className="p-3 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <img src={student.logo} alt="Logo" className="h-6 mb-1" />
                  <h2 className="text-xs font-bold">{student.institution}</h2>
                </div>
                <div className="text-right text-[8px]">
                  <p className="font-semibold text-gray-700">STUDENT ID CARD</p>
                  <p className="text-gray-500">Valid until: {student.expireDate}</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex mt-1">
                {/* Left Column */}
                <div className="w-2/3 pr-2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold uppercase leading-tight">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-xs text-gray-700">{student.department}</p>
                    <p className="text-xs text-blue-600 font-medium">{student.subject}</p>
                    <p className="text-xs text-purple-600">{student.category}</p>
                  </div>

                  <div className="text-[8px] space-y-1 mt-1">
                    <p><strong>ID No:</strong> {student.idNumber}</p>
                    <p><strong>D.O.B:</strong> {student.dob}</p>
                    <p><strong>Joined:</strong> {student.joinDate}</p>
                    <p><strong>Issued:</strong> {student.issueDate}</p>
                  </div>

                  <div className="flex justify-between items-end text-[7px] text-gray-600 mt-1">
                    <div>
                      <p>Email: {student.email}</p>
                      <p>Phone: {student.phone}</p>
                    </div>
                    <QRCodeCanvas value={student.verifyUrl} size={40} />
                  </div>
                </div>

                {/* Right Column */}
                <div className="w-1/3 flex flex-col items-center text-center">
                  <img
                    src={student.photo}
                    alt="Student"
                    className="h-24 w-20 object-cover border border-gray-300 rounded-lg mb-1 shadow-sm"
                  />

                  <div className="w-full mt-1">
                    <svg id="barcode" className="w-full h-10" />
                  </div>

                  <div className="mt-1 w-full border-t border-gray-300 pt-1 text-[7px]">
                    <p className="font-semibold">Authorized Signature</p>
                    {student.signature && (
                      <img
                        src={student.signature}
                        alt="Signature"
                        className="h-5 mx-auto"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BACK SIDE */}
          <div
            className="relative rounded-lg overflow-hidden border border-gray-300 shadow-lg"
            style={{
              width: "85.6mm",
              height: "53.98mm",
              background: "linear-gradient(to bottom right, #f3e5f5, #e1f5fe)",
            }}
          >
            <div className="p-3 h-full flex flex-col text-[8px]">
              <h3 className="text-center font-bold text-sm mb-2">STUDENT INFORMATION</h3>

              <div className="space-y-1 mb-2">
                <p><strong>Institution:</strong> {student.institution}</p>
                <p><strong>Address:</strong> {student.address}</p>
                <p><strong>Email:</strong> {student.email}</p>
              </div>

              <div className="mb-2">
                      <div className="mt-auto flex justify-between items-center text-[6px] text-gray-600">
                <QRCodeCanvas value={student.verifyUrl} size={40} />
                <div className="text-right ml-2">
                  <p>© {new Date().getFullYear()} {student.institution}</p>
                </div>
              </div>
                <h4 className="font-bold text-[9px] underline mb-1">RULES & REGULATIONS</h4>
                <ul className="list-disc list-inside space-y-0.5 text-[7px]">
                  <li>This card is property of {student.institution}</li>
                  <li>Must be carried at all times on campus</li>
                  <li>Not transferable - for owner's use only</li>
                  <li>Report lost cards immediately</li>
                  <li>Must be surrendered upon graduation/withdrawal</li>
                </ul>
              </div>

        
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCard;
