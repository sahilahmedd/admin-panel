"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

interface Page {
  id: number;
  title: string;
  link_url: string;
  active_yn: number;
}

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [open, setOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    link_url: "",
    active_yn: 1,
  });

  const api = "https://node2-plum.vercel.app/api/admin"

  const fetchPages = async () => {
    try {
      const res = await axios.get(`${api}/pages`);
      setPages(res.data.data);
    } catch (err) {
      console.error("Failed to fetch pages", err);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${api}/pages/${id}`);
      toast.success("Page deleted");
      fetchPages();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      link_url: page.link_url,
      active_yn: page.active_yn,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingPage) {
        await axios.put(`${api}/pages/${editingPage.id}`, formData);
        toast.success("Page updated");
      } else {
        await axios.post(`${api}/pages`, formData);
        toast.success("Page created");
      }
      setOpen(false);
      setEditingPage(null);
      setFormData({ title: "", link_url: "", active_yn: 1 });
      fetchPages();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="bg-background min-h-screen py-10 px-6">
      <Card className="max-w-4xl mx-auto border shadow-lg rounded-xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Manage Pages
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingPage(null);
                  setFormData({ title: "", link_url: "", active_yn: 1 });
                }}
                className="bg-primary text-white hover:bg-blue-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Page
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white p-6 rounded-lg shadow-md">
              <DialogHeader>
                <DialogTitle className="text-base font-bold">
                  {editingPage ? "Edit Page" : "Add Page"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm text-gray-700">Title</Label>
                  <Input
                    className="mt-1"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700">Link URL</Label>
                  <Input
                    className="mt-1"
                    value={formData.link_url}
                    onChange={(e) =>
                      setFormData({ ...formData, link_url: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700">Active</Label>
                  <select
                    className="w-full mt-1 border rounded px-3 py-2 text-sm text-gray-700"
                    value={formData.active_yn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        active_yn: Number(e.target.value),
                      })
                    }
                  >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
                <Button
                  className="w-full mt-2 bg-primary text-white hover:bg-blue-700"
                  onClick={handleSubmit}
                >
                  {editingPage ? "Update Page" : "Create Page"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-3 py-4">
          {pages.length === 0 ? (
            <p className="text-center text-gray-500">No pages available.</p>
          ) : (
            pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between bg-muted px-4 py-3 rounded-lg border"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {page.title}
                  </p>
                  <p className="text-xs text-gray-500">{page.link_url}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(page)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(page.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
