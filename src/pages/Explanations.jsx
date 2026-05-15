import { Home, ArrowRightLeft, History } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Explanations = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [contents, setContents] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);

  const mode = searchParams.get("mode") || "explanation";

  const getItemTime = (item) => {
    return new Date(item.createdAt || item.created_at || 0).getTime();
  };

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/contents?user_id=1"
        );

        if (!res.ok) {
          throw new Error("Failed to fetch contents");
        }

        const data = await res.json();

        console.log("CONTENTS:", data);

        setContents(data);

        const latestContent = [...data]
          .filter(
            (item) =>
              item.material_id &&
              ["summary", "explanation"].includes(item.type)
          )
          .sort((a, b) => getItemTime(b) - getItemTime(a))[0];

        if (latestContent) {
          setSelectedMaterialId(latestContent.material_id);
        }
      } catch (err) {
        console.error("Contents fetch failed:", err);
      }
    };

    fetchContents();
  }, []);

  // فلترة حسب المادة المختارة
  const selectedContents = selectedMaterialId
    ? contents.filter(
        (item) => item.material_id === selectedMaterialId
      )
    : [];

  // جيب explanation و summary
  const explanationItem = selectedContents.find(
    (item) => item.type === "explanation"
  );

  const summaryItem = selectedContents.find(
    (item) => item.type === "summary"
  );

  const content =
    mode === "explanation"
      ? explanationItem?.content_text ||
        "No explanation available yet. Generate study materials first."
      : summaryItem?.content_text ||
        "No summary available yet. Generate study materials first.";

  // تجميع المواد القديمة
  const groupedMaterials = Object.values(
    contents.reduce((groups, item) => {
      const key = item.material_id || item.id;

      if (!groups[key]) {
        groups[key] = {
          material_id: key,
          title:
            item.title ||
            item.content_text?.slice(0, 30) ||
            `Material ${key}`,
          created_at:
            item.createdAt || item.created_at,
          types: [],
        };
      }

      if (getItemTime(item) > getItemTime({ createdAt: groups[key].created_at })) {
        groups[key].created_at = item.createdAt || item.created_at;
      }

      if (item.type === "summary" && item.content_text) {
        groups[key].title =
          item.title ||
          item.content_text.slice(0, 30) ||
          `Material ${key}`;
      }

      if (!groups[key].types.includes(item.type)) {
        groups[key].types.push(item.type);
      }

      return groups;
    }, {})
  ).sort((a, b) => getItemTime(b) - getItemTime(a));

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">
          📖 Study Content
        </h1>

        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() =>
            setSearchParams({
              mode: "explanation",
            })
          }
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "explanation"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-secondary"
          }`}
        >
          Explanation
        </button>

        <button
          onClick={() =>
            setSearchParams({
              mode: "summary",
            })
          }
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "summary"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-secondary"
          }`}
        >
          Summary
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${selectedMaterialId}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="glass-card rounded-xl p-6 mb-5"
        >
          <h3 className="text-lg mb-3 capitalize">
            {mode}
          </h3>

          <div className="text-sm leading-relaxed whitespace-pre-line text-foreground">
            {content}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Convert button */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() =>
            setSearchParams({
              mode:
                mode === "explanation"
                  ? "summary"
                  : "explanation",
            })
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-edu-info text-edu-info-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Convert to{" "}
          {mode === "explanation"
            ? "Summary"
            : "Explanation"}
        </button>
      </div>

      {/* History */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-lg mb-3 flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" />
          Previous Content
        </h3>

        <div className="space-y-2">
          {groupedMaterials.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No previous content yet.
            </p>
          ) : (
            groupedMaterials.map((item) => (
              <div
                key={item.material_id}
                onClick={() =>
                  setSelectedMaterialId(
                    item.material_id
                  )
                }
                className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                  selectedMaterialId ===
                  item.material_id
                    ? "bg-primary/10"
                    : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {item.types.join(", ")}
                  </p>
                </div>

                <span className="text-xs text-muted-foreground">
                  {item.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleDateString()
                    : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Explanations;
