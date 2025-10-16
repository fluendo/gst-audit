import connexion

from main import GIRest, FridaResolver

def main():
    girest = GIRest("Gst", "1.0")
    spec = girest.generate()
    app = connexion.App(__name__)
    specd = spec.to_dict()
    # TODO use the correct PID
    resolver = FridaResolver(girest, 12031)
    app.add_api(specd, resolver=resolver, name="main_api")
    app.run(port=9000)


if __name__ == "__main__":
    main()


