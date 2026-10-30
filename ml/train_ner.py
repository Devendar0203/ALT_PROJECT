import os
import json
import torch
from pathlib import Path

# Label mappings
LABEL_LIST = [
    "O",
    "B-THREAT_ACTOR", "I-THREAT_ACTOR",
    "B-MALWARE", "I-MALWARE",
    "B-CVE", "I-CVE",
    "B-IOC", "I-IOC",
    "B-IP", "I-IP",
    "B-DOMAIN", "I-DOMAIN"
]

LABEL_TO_ID = {label: i for i, label in enumerate(LABEL_LIST)}
ID_TO_LABEL = {i: label for i, label in enumerate(LABEL_LIST)}


from transformers import AutoTokenizer, AutoModelForTokenClassification

def train_model():
    print("=== CyberGraph-X XLM-RoBERTa Token Classification Fine-Tuning ===")
    
    data_path = Path("ml/data/synthetic_multilingual_ner.json")
    if not data_path.exists():
        print(f"Error: {data_path} not found.")
        return

    with open(data_path, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    print(f"Loaded {len(dataset)} synthetic multilingual/code-mixed training samples.")
    
    model_dir = Path("ml/models/xlm-roberta-cti-ner")
    model_dir.mkdir(parents=True, exist_ok=True)

    print("Initializing XLM-RoBERTa Token Classification architecture...")
    tokenizer = AutoTokenizer.from_pretrained("xlm-roberta-base")
    model = AutoModelForTokenClassification.from_pretrained(
        "xlm-roberta-base",
        num_labels=len(LABEL_LIST),
        id2label=ID_TO_LABEL,
        label2id=LABEL_TO_ID
    )

    print("Fine-tuning XLM-RoBERTa on synthetic CTI dataset...")
    optimizer = torch.optim.AdamW(model.parameters(), lr=5e-5)
    model.train()

    epochs = 10
    for epoch in range(epochs):
        total_loss = 0.0
        for item in dataset:
            tokens = item["tokens"]
            tags = item["ner_tags"]

            inputs = tokenizer(
                tokens,
                is_split_into_words=True,
                return_tensors="pt",
                truncation=True
            )

            word_ids = inputs.word_ids(batch_index=0)
            labels = []
            for word_idx in word_ids:
                if word_idx is None:
                    labels.append(-100)
                else:
                    tag = tags[word_idx]
                    labels.append(LABEL_TO_ID.get(tag, 0))

            labels_tensor = torch.tensor([labels])

            optimizer.zero_grad()
            outputs = model(input_ids=inputs["input_ids"], attention_mask=inputs["attention_mask"], labels=labels_tensor)
            loss = outputs.loss
            loss.backward()
            optimizer.step()
            total_loss += loss.item()

        avg_loss = total_loss / len(dataset)
        print(f"  Epoch {epoch + 1}/{epochs} - Avg Loss: {avg_loss:.4f}")

    model.eval()

    print("Saving PyTorch model weights & tokenizer artifacts...")
    model.save_pretrained(model_dir)
    tokenizer.save_pretrained(model_dir)
    
    # Save label mappings
    mapping = {
        "label_list": LABEL_LIST,
        "label_to_id": LABEL_TO_ID,
        "id_to_label": ID_TO_LABEL,
        "model_name": "xlm-roberta-base",
        "synthetic_placeholder_notice": "Fine-tuned on synthetic CTI corpus for end-to-end framework demonstration."
    }
    
    with open(model_dir / "label_map.json", "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=2)

    # Save a metadata checkpoint state
    checkpoint_meta = {
        "status": "trained",
        "epoches": epochs,
        "dataset_samples": len(dataset),
        "target_entities": ["THREAT_ACTOR", "MALWARE", "CVE", "IOC", "IP", "DOMAIN"]
    }
    with open(model_dir / "checkpoint_info.json", "w", encoding="utf-8") as f:
        json.dump(checkpoint_meta, f, indent=2)
        
    print(f"Model checkpoints, weights, and metadata saved successfully under {model_dir}/")


if __name__ == "__main__":
    train_model()

