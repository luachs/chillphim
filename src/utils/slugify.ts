export const slugify = (text: string): string => {
  return (
    text
      .toLowerCase()
      .trim()
      // chuyển tiếng Việt có dấu → không dấu
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // thay đ → d
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      // bỏ ký tự đặc biệt
      .replace(/[^a-z0-9\s-]/g, "")
      // thay khoảng trắng → -
      .replace(/\s+/g, "-")
      // bỏ dấu - thừa
      .replace(/-+/g, "-")
  );
};
