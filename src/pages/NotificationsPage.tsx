import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Vote, Heart, Eye, Crown, Handshake, MessageCircle, User, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock notification data
const mockNotifications = {
  votes: [
    {
      id: "v1",
      type: "vote_cast",
      candidateName: "בנימין נתניהו",
      position: "ראש הממשלה",
      timestamp: "לפני 2 שעות",
      status: "active"
    },
    {
      id: "v2", 
      type: "vote_cast",
      candidateName: "ירון זליכה",
      position: "שר הכלכלה",
      timestamp: "לפני יום",
      status: "active"
    }
  ],
  trustedBy: [
    {
      id: "t1",
      username: "דוד לוי",
      avatar: "/api/placeholder/32/32",
      domain: "כלכלה",
      timestamp: "לפני שעה",
      isNew: true
    },
    {
      id: "t2",
      username: "מיכל כהן",
      avatar: "/api/placeholder/32/32", 
      domain: "חינוך",
      timestamp: "לפני 3 שעות",
      isNew: true
    },
    {
      id: "t3",
      username: "אבי רוזן",
      avatar: "/api/placeholder/32/32",
      domain: "ביטחון", 
      timestamp: "לפני יום",
      isNew: false
    }
  ],
  following: [
    {
      id: "f1",
      username: "ד״ר מאיה רוזמן",
      avatar: "/api/placeholder/32/32",
      postTitle: "למה חשוב לשלב ירקות בכל ארוחה",
      timestamp: "לפני 30 דקות",
      isNew: true
    },
    {
      id: "f2", 
      username: "יעקב אליעזרוב",
      avatar: "/api/placeholder/32/32",
      postTitle: "תודה לה' על הברכות בעסק התכשיטים",
      timestamp: "לפני 2 שעות",
      isNew: true
    }
  ],
  interactions: [
    {
      id: "i1",
      type: "zooz_received",
      username: "שלום גבריאל",
      amount: 5,
      postTitle: "העתיד של הדמוקרטיה תלוי ברשתות אמון",
      timestamp: "לפני 45 דקות",
      isNew: true
    },
    {
      id: "i2",
      type: "comment",
      username: "רחל שטיין",
      postTitle: "מה שלמדתי מהבחירות האחרונות",
      timestamp: "לפני שעה", 
      isNew: true
    }
  ]
};

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'vote_cast':
        return <Vote className="w-4 h-4 text-vote" />;
      case 'trusted_by':
        return <Crown className="w-4 h-4 text-trust" />;
      case 'following':
        return <Eye className="w-4 h-4 text-watch" />;
      case 'zooz_received':
        return <div className="w-4 h-4 bg-zooz rounded-full flex items-center justify-center text-white text-xs font-bold">Z</div>;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-primary" />;
      default:
        return <Heart className="w-4 h-4 text-red-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  const AllNotifications = () => {
    const allNotifs = [
      ...notifications.votes.map(v => ({ ...v, category: 'votes' })),
      ...notifications.trustedBy.map(t => ({ ...t, type: 'trusted_by', category: 'trust' })),
      ...notifications.following.map(f => ({ ...f, type: 'following', category: 'following' })),
      ...notifications.interactions.map(i => ({ ...i, category: 'interactions' }))
    ].sort((a, b) => {
      // Simple timestamp sorting (would use proper dates in real app)
      const aTime = a.timestamp.includes('דקות') ? 1 : a.timestamp.includes('שעה') ? 2 : 3;
      const bTime = b.timestamp.includes('דקות') ? 1 : b.timestamp.includes('שעה') ? 2 : 3;
      return aTime - bTime;
    });

    return (
      <div className="space-y-3">
        {allNotifs.map((notif) => (
          <Card key={notif.id} className={cn(
            "transition-all hover:shadow-sm",
            'isNew' in notif && notif.isNew && "bg-accent/20 border-primary/20"
          )}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm">
                      {notif.type === 'vote_cast' && (
                        <span>הצבעת עבור <strong>{(notif as any).candidateName}</strong> לתפקיד {(notif as any).position}</span>
                      )}
                      {notif.type === 'trusted_by' && (
                        <span><strong>{(notif as any).username}</strong> הביע אמון בך בתחום {(notif as any).domain}</span>
                      )}
                      {notif.type === 'following' && (
                        <span><strong>{(notif as any).username}</strong> פרסם: {(notif as any).postTitle}</span>
                      )}
                      {notif.type === 'zooz_received' && (
                        <span><strong>{(notif as any).username}</strong> שלח לך {(notif as any).amount} ZOOZ על "{(notif as any).postTitle}"</span>
                      )}
                      {notif.type === 'comment' && (
                        <span><strong>{(notif as any).username}</strong> הגיב על "{(notif as any).postTitle}"</span>
                      )}
                    </div>
                    {'isNew' in notif && notif.isNew && (
                      <Badge variant="secondary" className="text-xs">חדש</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatTime(notif.timestamp)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center gap-4 p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">התראות</h1>
            <p className="text-sm text-muted-foreground">עדכונים על פעילותך ברשת</p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 ml-1" />
            סנן
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all">הכל</TabsTrigger>
            <TabsTrigger value="votes">הצבעות</TabsTrigger>
            <TabsTrigger value="trust">אמון</TabsTrigger>
            <TabsTrigger value="following">מעקב</TabsTrigger>
            <TabsTrigger value="interactions">אינטראקציות</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <AllNotifications />
          </TabsContent>

          <TabsContent value="votes">
            <div className="space-y-3">
              {notifications.votes.map((vote) => (
                <Card key={vote.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Vote className="w-4 h-4 text-vote mt-1" />
                      <div className="flex-1">
                        <p className="text-sm">
                          הצבעת עבור <strong>{vote.candidateName}</strong> לתפקיד {vote.position}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{vote.timestamp}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {vote.status === 'active' ? 'פעיל' : 'הסתיים'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trust">
            <div className="space-y-3">
              {notifications.trustedBy.map((trust) => (
                <Card key={trust.id} className={cn(
                  "transition-all hover:shadow-sm",
                  trust.isNew && "bg-accent/20 border-primary/20"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={trust.avatar} />
                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm">
                            <strong>{trust.username}</strong> הביע אמון בך בתחום {trust.domain}
                          </p>
                          {trust.isNew && (
                            <Badge variant="secondary" className="text-xs">חדש</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{trust.timestamp}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="following">
            <div className="space-y-3">
              {notifications.following.map((follow) => (
                <Card key={follow.id} className={cn(
                  "transition-all hover:shadow-sm cursor-pointer",
                  follow.isNew && "bg-accent/20 border-primary/20"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={follow.avatar} />
                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm">
                            <strong>{follow.username}</strong> פרסם פוסט חדש
                          </p>
                          {follow.isNew && (
                            <Badge variant="secondary" className="text-xs">חדש</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">"{follow.postTitle}"</p>
                        <p className="text-xs text-muted-foreground">{follow.timestamp}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interactions">
            <div className="space-y-3">
              {notifications.interactions.map((interaction) => (
                <Card key={interaction.id} className={cn(
                  "transition-all hover:shadow-sm",
                  interaction.isNew && "bg-accent/20 border-primary/20"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(interaction.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm">
                            {interaction.type === 'zooz_received' && (
                              <span><strong>{interaction.username}</strong> שלח לך {interaction.amount} ZOOZ</span>
                            )}
                            {interaction.type === 'comment' && (
                              <span><strong>{interaction.username}</strong> הגיב על הפוסט שלך</span>
                            )}
                          </p>
                          {interaction.isNew && (
                            <Badge variant="secondary" className="text-xs">חדש</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">"{interaction.postTitle}"</p>
                        <p className="text-xs text-muted-foreground">{interaction.timestamp}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};