export class Ticket {
    public owner: String
	public event: {
		name: String,
		FolderUrl: String,
		logoUrl: String,
		date: String,
		hour: String,
		address: String,
    }
        
	public seat: {
		session: String,
		number: String,  // número do assento
		type: String,
    }
    
	public edition: {
		circulation: String, // número da tiragem
		serial: String, 	// número de série
	}
}
