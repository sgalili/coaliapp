import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, User } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isFrequent?: boolean;
}

interface ContactPickerProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onContactSelect: (contact: Contact) => void;
}

export const ContactPicker = ({ contacts, selectedContact, onContactSelect }: ContactPickerProps) => {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>לא נמצאו אנשי קשר</p>
      </div>
    );
  }

  // Separate frequent and regular contacts
  const frequentContacts = contacts.filter(contact => contact.isFrequent);
  const regularContacts = contacts.filter(contact => !contact.isFrequent);

  return (
    <div className="space-y-4 max-h-64 overflow-y-auto">
      {/* Frequent Contacts */}
      {frequentContacts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
            <Star className="w-4 h-4" />
            אנשי קשר תכופים
          </div>
          <div className="space-y-2">
            {frequentContacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                isSelected={selectedContact?.id === contact.id}
                onSelect={() => onContactSelect(contact)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Contacts */}
      {regularContacts.length > 0 && (
        <div>
          {frequentContacts.length > 0 && (
            <div className="text-sm font-medium text-muted-foreground mb-3">
              כל אנשי הקשר
            </div>
          )}
          <div className="space-y-2">
            {regularContacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                isSelected={selectedContact?.id === contact.id}
                onSelect={() => onContactSelect(contact)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: () => void;
}

const ContactItem = ({ contact, isSelected, onSelect }: ContactItemProps) => {
  return (
    <Button
      variant={isSelected ? "default" : "ghost"}
      onClick={onSelect}
      className="w-full justify-start h-auto p-3"
    >
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="w-8 h-8">
          <AvatarImage src={contact.avatar} />
          <AvatarFallback>
            {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="text-right flex-1">
          <div className="font-medium">{contact.name}</div>
          <div className="text-sm text-muted-foreground">{contact.username}</div>
        </div>
        {contact.isFrequent && (
          <Star className="w-4 h-4 text-primary" fill="currentColor" />
        )}
      </div>
    </Button>
  );
};