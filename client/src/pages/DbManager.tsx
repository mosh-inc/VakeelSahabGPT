import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function DbManager() {
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions");
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sessions",
        variant: "destructive",
      });
    }
  };

  // Fetch messages for a session
  const fetchMessages = async (sessionId: string) => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/messages/${sessionId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        toast({
          title: "Success",
          description: "Message deleted successfully",
        });

        // Refresh messages after deletion
        if (selectedSession) {
          fetchMessages(selectedSession);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete message",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession);
    }
  }, [selectedSession]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Database Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full mb-4"
              onClick={fetchSessions}
            >
              Refresh Sessions
            </Button>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <Button
                    key={session}
                    variant={selectedSession === session ? "default" : "outline"}
                    className="w-full text-left justify-start text-xs truncate"
                    onClick={() => setSelectedSession(session)}
                  >
                    {session}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No sessions found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSession ? (
              <>
                <div className="mb-4 flex items-center">
                  <p className="text-sm text-gray-500 truncate flex-1">
                    Session: {selectedSession}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fetchMessages(selectedSession)}
                  >
                    Refresh
                  </Button>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <Card key={message.id} className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">
                              {message.role}
                            </span>
                            {message.category && (
                              <span className="text-xs font-medium bg-blue-100 px-2 py-0.5 rounded ml-2">
                                {message.category}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            onClick={() => deleteMessage(message.id)}
                          >
                            ×
                          </Button>
                        </div>
                        <p className="mt-2 text-sm break-words">
                          {message.content.length > 100
                            ? `${message.content.substring(0, 100)}...`
                            : message.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          ID: {message.id} • {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No messages found</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Select a session to view messages</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}