import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit3, Check, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableFieldProps {
  value: string | string[];
  onSave: (newValue: string | string[]) => void;
  type?: "text" | "textarea" | "tags";
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

export const EditableField = ({
  value,
  onSave,
  type = "text",
  placeholder,
  className,
  maxLength
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(Array.isArray(value) ? value.join(", ") : value);
  const [newTag, setNewTag] = useState("");

  const handleSave = () => {
    if (type === "tags") {
      const tags = editValue.split(",").map(tag => tag.trim()).filter(tag => tag);
      onSave(tags);
    } else {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(Array.isArray(value) ? value.join(", ") : value);
    setIsEditing(false);
  };

  const addTag = () => {
    if (newTag.trim() && Array.isArray(value)) {
      const newTags = [...value, newTag.trim()];
      onSave(newTags);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (Array.isArray(value)) {
      const newTags = value.filter(tag => tag !== tagToRemove);
      onSave(newTags);
    }
  };

  if (type === "tags" && !isEditing) {
    return (
      <div className={cn("group relative", className)}>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(value) && value.map((tag, index) => (
            <Badge key={index} variant="secondary" className="relative group/tag">
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="w-4 h-4 ml-1 opacity-0 group/tag:opacity-100 transition-opacity"
                onClick={() => removeTag(tag)}
              >
                <X className="w-2 h-2" />
              </Button>
            </Badge>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="הוסף תחום מומחיות"
              className="w-32 h-6 text-xs"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={addTag}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-1 -left-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Edit3 className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className={cn("group relative", className)}>
        <div>{Array.isArray(value) ? value.join(", ") : value}</div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-1 -left-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Edit3 className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {type === "textarea" ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="resize-none"
          rows={3}
        />
      ) : (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={handleSave}>
          <Check className="w-4 h-4 text-green-600" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
};

export default EditableField;