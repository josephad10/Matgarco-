interface Props {
  storeName: string;
  onGo: () => void;
}

export default function StepDone({ storeName, onGo }: Props) {
  return (
    <div className="p-12 text-center">
      {/* Celebration */}
      <div className="text-8xl mb-6 animate-bounce">🎉</div>
      <h1 className="text-3xl font-black text-gray-900 mb-3">
        {storeName ? `${storeName} جاهز!` : 'متجرك جاهز!'}
      </h1>
      <p className="text-gray-500 mb-2 text-sm">
        تم إنشاء متجرك بنجاح وهو الآن مرئي للزوار.
      </p>
      <p className="text-sm text-indigo-600 font-medium mb-8">
        يمكنك الآن إضافة منتجاتك وتعديل تصميم متجرك.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onGo}
          className="px-8 py-3.5 rounded-xl font-bold text-white text-sm bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          انتقل إلى لوحة التحكم →
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        💡 نصيحة: ابدأ بإضافة بعض المنتجات لإحياء متجرك!
      </p>
    </div>
  );
}
