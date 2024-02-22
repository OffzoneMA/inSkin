class DogBreedsDataset(Dataset):
    def __init__(self, csv_file, root_dir, transform=None):
        """
        Args:
            csv_file (string): Chemin vers le fichier CSV contenant les étiquettes des images.
            root_dir (string): Répertoire contenant les images.
            transform (callable, optional): Transformation à appliquer sur les images.
        """
        # Lecture du fichier CSV contenant les étiquettes
        self.labels_frame = pd.read_csv(csv_file)
        
        # Création d'un dictionnaire pour mapper les classes aux indices et vice-versa
        self.class_to_idx = {breed: idx for idx, breed in enumerate(self.labels_frame['breed'].unique())}
        self.idx_to_class = {idx: breed for breed, idx in self.class_to_idx.items()}
        
        # Mapping des classes aux indices dans le DataFrame
        self.map = dict(zip(self.labels_frame['breed'].unique(), range(0, len(self.labels_frame['breed'].unique()))))
        self.labels_frame['breed'] = self.labels_frame['breed'].map(self.map)
        
        # Chemin vers le répertoire contenant les images
        self.root_dir = root_dir
        
        # Transformation à appliquer sur les images
        self.transform = transform
    
    def getmap(self):
        """Retourne le dictionnaire qui mappe les classes aux indices."""
        return self.class_to_idx
    
    def __getclasses__(self):
        """Retourne la liste des classes uniques."""
        return self.labels_frame['breed'].unique().tolist()

    def __len__(self):
        """Retourne le nombre total d'images dans le jeu de données."""
        return len(self.labels_frame)

    def __getitem__(self, idx):
        """
        Récupère une image et son étiquette correspondante à partir de l'index donné.

        Args:
            idx (int): L'index de l'image à récupérer.

        Returns:
            tuple: (image, label) où
                image (PIL Image): L'image.
                label (int): L'indice correspondant à la classe de l'image.
        """
        # Chemin vers l'image
        img_name = os.path.join(self.root_dir, self.labels_frame.iloc[idx, 0] + '.jpg')
        
        # Chargement de l'image
        image = io.imread(img_name)
        
        # Conversion de l'image en format PIL
        PIL_image = Image.fromarray(image)
        
        # Récupération de l'étiquette de l'image
        label = self.labels_frame.iloc[idx, 1]
        label = np.array(label)
        label = torch.from_numpy(label).long()
        
        # Application de la transformation sur l'image si elle est spécifiée
        if self.transform:
            image = self.transform(PIL_image)
        
        return image, label

# Chemin vers le fichier CSV contenant les étiquettes
csv='/kaggle/input/dog-breed-identification/labels.csv'

# Répertoire contenant les images
root='/kaggle/input/dog-breed-identification/train'

# Définition des transformations à appliquer sur les images
transformer =  transforms.Compose([
    transforms.RandomResizedCrop(size=256, scale=(0.95, 1.0)),
    transforms.RandomRotation(degrees=15),
    transforms.ColorJitter(),
    transforms.RandomHorizontalFlip(),
    transforms.CenterCrop(size=224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Création de l'instance du jeu de données
alldata = DogBreedsDataset(csv_file=csv, root_dir=root, transform=transformer)

# Affichage d'informations sur le jeu de données
print("Dispositif utilisé:", device)
print('**'*40)
print("Nombre d'éléments dans le dataset :", len(alldata))
print("Classes uniques :", len(alldata.__getclasses__()))
print('**'*40)

# Récupération de la correspondance entre les classes et les indices
class_map = alldata.getmap()
class_table = [(key, value) for key, value in class_map.items()]
print("Correspondance des classes :")
print(tabulate(class_table, headers=['Classe', 'Index']))
print('**'*40)

# Chargement des données avec DataLoader
batch_size = 32
data_loader = DataLoader(alldata, batch_size=batch_size, shuffle=True)

# Fonction pour afficher des images avec leurs étiquettes
def show_images_with_labels(images, labels, class_map):
    class_names = list(class_map.keys())
    num_images = len(images)
    num_cols = 8 
    num_rows = (num_images - 1) // num_cols + 1
    plt.figure(figsize=(15, 3*num))
    
class CustomVGG16MultiClass(nn.Module):
    """
    Modèle personnalisé VGG16 pour la classification multi-classe.
    """

    def __init__(self, num_classes):
        """
        Initialise le modèle CustomVGG16MultiClass.

        Args:
        - num_classes (int): Nombre de classes pour la classification.
        """
        super(CustomVGG16MultiClass, self).__init__()

        # Charge le modèle VGG16 pré-entraîné
        vgg16 = models.vgg16(pretrained=True)

        # Gèle les paramètres de l'extraction des caractéristiques
        for param in vgg16.features.parameters():
            param.requires_grad = False

        # Extrait les modules de caractéristiques et de classification du modèle VGG16
        self.features = vgg16.features
        self.classifier = vgg16.classifier

        # Obtient le nombre de caractéristiques en entrée pour la dernière couche entièrement connectée
        in_features = vgg16.classifier[-1].in_features

        # Remplace la dernière couche entièrement connectée par une nouvelle couche linéaire
        self.classifier[-1] = nn.Linear(in_features, num_classes)

    def forward(self, x):
        """
        Passe avant à travers le réseau.

        Args:
        - x (torch.Tensor): Tenseur d'entrée.

        Returns:
        - torch.Tensor: Tenseur de sortie.
        """
        # Passe l'entrée à travers l'extraction des caractéristiques
        x = self.features(x)
        
        # Remodelle le tenseur de caractéristiques
        x = x.view(x.size(0), -1)
        
        # Passe les caractéristiques à travers le classificateur
        x = self.classifier(x)
        
        return x

# Nombre de classes dans le jeu de données
num_classes = 120

# Crée une instance du modèle CustomVGG16MultiClass
model = CustomVGG16MultiClass(num_classes).to(device)

# Crée un DataLoader pour l'ensemble du jeu de données
all_data_loader = DataLoader(alldata, batch_size=batch_size, shuffle=True)

# Teste le modèle sur un lot de données
for i, (x, y) in enumerate(all_data_loader):
    # Déplace les données d'entrée sur le périphérique (GPU si disponible)
    x = x.to(device)
    
    # Effectue la passe avant
    output = model(x)
    
    # Arrête après le traitement d'un lot
    break

print("Le modèle est prêt.")