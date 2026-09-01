import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "اختبار بصمتك العطرية | بديل عطر ٢",
  description:
    "اكتشف بصمتك العطرية عبر اختبار قصير من ستة أسئلة، واحصل على أفضل العطور والبدائل المناسبة لذوقك من قائمة بديل عطر ٢.",
};

export default function QuizPage() {
  return <QuizClient />;
}
