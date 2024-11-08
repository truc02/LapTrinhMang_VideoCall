"use client"; // Chỉ thị rằng đây là một component phía client (Client Component)

import { useUser } from "@clerk/nextjs"; // Import hook để lấy thông tin người dùng từ Clerk
import { useStreamVideoClient } from "@stream-io/video-react-sdk"; // Import hook để lấy client từ Stream Video SDK
import { useRouter } from "next/navigation"; // Import hook để điều hướng từ Next.js

import { useGetCallById } from "@/hooks/useGetCallById"; // Import hook tùy chỉnh để lấy thông tin cuộc gọi theo ID
import { Button } from "@/components/ui/button"; // Import component nút tuỳ chỉnh
import { useToast } from "@/components/ui/use-toast"; // Import hook để hiển thị thông báo toast

// Component hiển thị bảng thông tin với tiêu đề và mô tả
const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

// Component chính - PersonalRoom
const PersonalRoom = () => {
  const router = useRouter(); // Lấy router để điều hướng trong Next.js
  const { user } = useUser(); // Lấy thông tin người dùng từ Clerk
  const client = useStreamVideoClient(); // Lấy client Stream Video
  const { toast } = useToast(); // Lấy hook để hiển thị thông báo toast

  const meetingId = user?.id; // Sử dụng ID người dùng làm ID cuộc họp

  const { call } = useGetCallById(meetingId!); // Sử dụng hook tùy chỉnh để lấy thông tin cuộc gọi theo meetingId

  // Hàm bắt đầu cuộc họp
  const startRoom = async () => {
    if (!client || !user) return; // Kiểm tra nếu không có client hoặc người dùng, thoát khỏi hàm

    const newCall = client.call("default", meetingId!); // Tạo cuộc gọi mới với client từ Stream Video SDK

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(), // Thiết lập thời gian bắt đầu cuộc gọi
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`); // Điều hướng đến trang cuộc họp cá nhân
  };

  // Tạo liên kết mời dựa vào biến môi trường và meetingId
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.username}'s Meeting Room`} /> {/* Hiển thị tiêu đề cuộc họp */}
        <Table title="Meeting ID" description={meetingId!} /> {/* Hiển thị ID cuộc họp */}
        <Table title="Invite Link" description={meetingLink} /> {/* Hiển thị liên kết mời */}
      </div>
      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Meeting {/* Nút bắt đầu cuộc họp */}
        </Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink); // Sao chép liên kết mời vào clipboard
            toast({
              title: "Link Copied", // Hiển thị thông báo toast khi liên kết được sao chép
            });
          }}
        >
          Copy Invitation {/* Nút sao chép liên kết mời */}
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom; // Xuất PersonalRoom để có thể sử dụng trong các file khác
