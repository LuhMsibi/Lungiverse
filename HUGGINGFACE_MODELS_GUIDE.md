# How to Find and Add Hugging Face AI Models to Lungiverse

**Article Metadata for Admin Panel:**
- **Title:** How to Find and Add Hugging Face AI Models to Lungiverse
- **Slug:** add-huggingface-models-guide
- **Category:** Admin Guides
- **Read Time:** 8 min read
- **Tags:** admin, hugging-face, ai-models, playground, tutorial
- **Excerpt:** A complete step-by-step guide for administrators on discovering, testing, and adding new Hugging Face AI models to the Lungiverse AI Playground.

---

## Introduction to Hugging Face Models

Hugging Face is the leading platform for AI models, hosting thousands of free language models, image generators, and more. This guide will show you how to find, test, and add these models to Lungiverse's AI Playground.

## Step 1: Finding Models on Hugging Face

### Visit Hugging Face Hub
Go to https://huggingface.co/models

### Filter for Compatible Models
Look for models that support **text-generation** or **chat-completion** tasks. Popular categories include:

- **Text AI:** Conversational models like Llama, Mistral, Qwen
- **Code AI:** Code generation models like CodeLlama, StarCoder
- **Image AI:** Image generation models (coming soon)

### Recommended Free Models to Add

Here are excellent free models you can add right now:

1. **meta-llama/Llama-3.2-3B-Instruct** - Fast, lightweight chat model
2. **mistralai/Mistral-7B-Instruct-v0.3** - High-quality instruction model
3. **Qwen/Qwen2.5-7B-Instruct** - Multilingual chat model
4. **deepseek-ai/DeepSeek-R1-Distill-Qwen-7B** - Reasoning-focused model
5. **microsoft/Phi-3.5-mini-instruct** - Compact but capable

## Step 2: Gather Required Information

Before adding a model, collect these details from the Hugging Face model page:

### Model ID
This is the full path shown in the URL. Example: `meta-llama/Llama-3.2-3B-Instruct`

### Name
A user-friendly display name. Example: `Llama 3.2 3B Instruct`

### Description
Brief explanation of what the model does. Read the model card on Hugging Face for ideas.

### Category
Choose from: Text AI, Image AI, Audio AI, Code AI

### Max Tokens
Maximum response length. Recommended values:
- **500-1024:** For quick responses (chat, Q&A)
- **2048-4096:** For longer content (articles, code)

## Step 3: Test the Model (Optional but Recommended)

Before adding to Lungiverse, test the model on Hugging Face:

1. Click on the model page
2. Look for the "Inference API" or "Try it out" section
3. Send a test prompt and verify it responds correctly
4. Check response quality and speed

## Step 4: Add Model to Lungiverse

### Access Admin Panel
1. Log in to Lungiverse as an admin
2. Navigate to `/admin/interactive-models`

### Fill Out the Form
- **Name:** User-friendly name (e.g., "Llama 3.2 3B Instruct")
- **Hugging Face Model ID:** Full model path (e.g., "meta-llama/Llama-3.2-3B-Instruct")
- **Category:** Select appropriate category
- **Description:** Brief explanation of capabilities
- **Max Tokens:** Set response length limit (recommended: 500-2048)
- **Active:** Check to make model available to users
- **Featured:** Check to highlight on Playground homepage

### Click "Add Model"
The model will be immediately available in the AI Playground!

## Step 5: Verify the Model Works

1. Go to `/playground`
2. Find your newly added model in the list
3. Click to open the chat interface
4. Send a test message
5. Verify you get a proper response

## Troubleshooting Common Issues

### Model Not Showing in Playground
- Ensure "Active" checkbox was checked
- Refresh the page
- Check that the model ID is correct (no typos)

### "Failed to Generate Response" Error
- Verify the Model ID exactly matches the Hugging Face model path
- Some models may be rate-limited on the free tier
- Try a different model from the recommended list

### Slow Response Times
- Larger models (70B+) are slower on free tier
- Stick to 3B-7B models for best performance
- Reduce max tokens to speed up responses

## Best Practices

- **Start with popular models:** They're better tested and more reliable
- **Test before making active:** Uncheck "Active" initially, test, then enable
- **Use descriptive names:** Help users understand what the model does
- **Keep max tokens reasonable:** 500-1024 for most use cases
- **Update descriptions:** Add your own testing insights to help users

## Recommended Models by Category

### Text AI (Conversational)
- meta-llama/Llama-3.2-3B-Instruct
- mistralai/Mistral-7B-Instruct-v0.3
- Qwen/Qwen2.5-7B-Instruct

### Code AI (Programming)
- Qwen/Qwen2.5-Coder-7B-Instruct
- meta-llama/CodeLlama-7b-Instruct-hf
- microsoft/Phi-3.5-mini-instruct (good for code too)

### Multilingual
- Qwen/Qwen2.5-7B-Instruct (50+ languages)
- meta-llama/Llama-3.2-3B-Instruct (multilingual)

## Keeping Your Model Library Fresh

- Check Hugging Face weekly for new trending models
- Monitor user feedback in the Playground
- Remove underperforming models periodically
- Update descriptions based on user usage patterns

By following this guide, you'll be able to continuously expand Lungiverse's AI Playground with the latest and greatest models from Hugging Face!
