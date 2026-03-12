import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Mail, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { apiClient } from '@/services/api';

const formatTemplateName = (templateType?: string) =>
  (templateType || 'template')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const TemplateEditor: React.FC = () => {
  const navigate = useNavigate();
  const { templateType } = useParams<{ templateType: string }>();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const latestContentRef = useRef('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

  const getCurrentHtml = () => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    return doc ? `<!DOCTYPE html>\n${doc.documentElement.outerHTML}` : content;
  };

  const getPlainTextFromHtml = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return (doc.body.textContent || '')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      .trim();
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/templates/${templateType}`);
        setContent(response.data.data.content);
        latestContentRef.current = response.data.data.content;
        setEmailSubject(`${formatTemplateName(templateType)} Template`);
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to load template');
        navigate('/admin/templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [navigate, templateType]);

  const enableDirectEditing = () => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;

    if (!doc) return;

    doc.designMode = 'off';
    doc.body.contentEditable = 'true';
    doc.body.spellcheck = false;
    doc.body.setAttribute('data-direct-editor', 'true');

    const style = doc.createElement('style');
    style.textContent = `
      body[data-direct-editor="true"] {
        cursor: text;
      }

      body[data-direct-editor="true"] img,
      body[data-direct-editor="true"] table,
      body[data-direct-editor="true"] tr,
      body[data-direct-editor="true"] td,
      body[data-direct-editor="true"] th {
        user-select: text;
      }

      body[data-direct-editor="true"] *:focus {
        outline: none;
      }

      body[data-direct-editor="true"] ::selection {
        background: rgba(59, 130, 246, 0.18);
      }
    `;
    doc.head.appendChild(style);

    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        event.preventDefault();
      }
    });

    doc.oninput = () => {
      latestContentRef.current = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
    };
  };

  const handleSave = async () => {
    try {
      const updatedContent = getCurrentHtml() || latestContentRef.current || content;

      setSaving(true);
      await apiClient.put(`/templates/${templateType}`, { content: updatedContent });
      setContent(updatedContent);
      latestContentRef.current = updatedContent;
      alert('Template saved successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail || !emailSubject) {
      alert('Recipient email and subject are required');
      return;
    }

    try {
      setSending(true);
      await apiClient.post(`/templates/send-email/${templateType}`, {
        to: recipientEmail,
        subject: emailSubject,
        html: getCurrentHtml(),
        text: getPlainTextFromHtml(getCurrentHtml()),
      });
      setIsEmailModalOpen(false);
      alert('Email sent successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/admin/templates')} className="w-full sm:w-auto">
        <ArrowLeft size={18} className="mr-2" />
        Back to Templates
      </Button>

      <div className="sticky top-4 z-10 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Edit {formatTemplateName(templateType)}
          </h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
              <Save size={18} className="mr-2" />
              {saving ? 'Saving...' : 'Save Template'}
            </Button>
            <Button variant="outline" onClick={() => setIsEmailModalOpen(true)} className="w-full sm:w-auto">
              <Mail size={18} className="mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-gray-200 bg-gray-50 px-5 py-3 text-sm font-medium text-gray-700">
          Direct Editor
        </div>
        <iframe
          ref={iframeRef}
          srcDoc={content}
          title="Template Direct Editor"
          className="h-[68vh] min-h-[420px] w-full border-0 bg-white sm:h-[74vh] lg:h-[82vh]"
          onLoad={enableDirectEditing}
        />
      </Card>

      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Send Template Email"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Recipient Email"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="hr@example.com"
          />
          <Input
            label="Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Template Subject"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setIsEmailModalOpen(false)} disabled={sending} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={sending} className="w-full sm:w-auto">
              <Mail size={18} className="mr-2" />
              {sending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
